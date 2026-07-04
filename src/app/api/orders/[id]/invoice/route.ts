import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/auth';
import { getCurrencyRates } from '@/lib/currency';
import fs from 'fs';
import path from 'path';

// @ts-ignore
import PizZip from 'pizzip';
// @ts-ignore
import Docxtemplater from 'docxtemplater';

/**
 * Recursively search and remove <p:sp> elements containing the target text.
 * This is used to delete empty background shapes (e.g. {{ITEM_3_BG}}) if
 * the order contains fewer than 6 items.
 */
function removeShapeContainingText(xml: string, text: string): string {
  let index = xml.indexOf(text);
  while (index !== -1) {
    // Search backward for PowerPoint shape tags (<p:sp>)
    const openTagRegex = /<p:sp\b/g;
    let match;
    let lastOpenIndex = -1;
    
    openTagRegex.lastIndex = 0;
    while ((match = openTagRegex.exec(xml.substring(0, index))) !== null) {
      lastOpenIndex = match.index;
    }
    
    if (lastOpenIndex !== -1) {
      const closeTag = "</p:sp>";
      const closeIndex = xml.indexOf(closeTag, index);
      if (closeIndex !== -1) {
        const endOfClose = closeIndex + closeTag.length;
        // Slice out the entire shape block
        xml = xml.substring(0, lastOpenIndex) + xml.substring(endOfClose);
        index = xml.indexOf(text);
        continue;
      }
    }
    break;
  }
  return xml;
}

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  // 1. Authenticate request
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // 2. Fetch order details from database
    const order = await prisma.order.findUnique({
      where: { id },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Ensure user has permission (Admin OR Customer Owner)
    const isAdmin = session.user.role === 'admin';
    const isOwner = session.user.email === order.email;
    if (!isAdmin && !isOwner) {
      return NextResponse.json({ error: 'Unauthorized to access this invoice' }, { status: 403 });
    }

    // Prices are stored in LKR — no conversion needed

    // 4. Map template placeholders (without the delimiters, as required by docxtemplater)
    const invoiceNo = order.id.slice(-6).toUpperCase();
    const invoiceDate = new Date(order.createdAt).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
    const customerName = `${order.firstName} ${order.lastName}`.trim();
    const email = order.email;
    const phone = order.phone || '';
    const country = order.country || '';

    // Calculate pricing in LKR
    const subtotalLKR = Math.round(order.items.reduce((acc, item) => acc + item.price * item.quantity, 0));
    const totalLKR = Math.round(order.totalAmount);
    const taxLKR = 0;

    const replacements: Record<string, string> = {
      CUSTOMER_NAME: customerName,
      EMAIL: email,
      PHONE: phone,
      COUNTRY: country,
      INVOICE_DATE: invoiceDate,
      INVOICE_NO: invoiceNo,
      SUBTOTAL: `Rs. ${subtotalLKR.toLocaleString()}`,
      TAX: `Rs. ${taxLKR.toLocaleString()}`,
      TOTAL: `Rs. ${totalLKR.toLocaleString()}`,
    };

    // Handle invoice line items (up to 6 slots)
    for (let i = 1; i <= 6; i++) {
      const item = order.items[i - 1];
      if (item) {
        const itemTitle = `${item.title}${item.duration && item.duration !== 'N/A' ? ' / ' + item.duration : ''}`;
        const itemPriceLKR = Math.round(item.price);
        const itemTotalLKR = Math.round(item.price * item.quantity);

        replacements[`ITEM_${i}_NAME`] = itemTitle;
        replacements[`ITEM_${i}_PRICE`] = `Rs. ${itemPriceLKR.toLocaleString()}`;
        replacements[`item_${i}_qty`] = item.quantity.toString();
        replacements[`ITEM_${i}_TOTAL`] = `Rs. ${itemTotalLKR.toLocaleString()}`;
        replacements[`ITEM_${i}_BG`] = '';
      } else {
        // Clear unused item slots
        replacements[`ITEM_${i}_NAME`] = '';
        replacements[`ITEM_${i}_PRICE`] = '';
        replacements[`item_${i}_qty`] = '';
        replacements[`ITEM_${i}_TOTAL`] = '';
        replacements[`ITEM_${i}_BG`] = '';
      }
    }

    // 5. Locate PPTX Template
    const isConfirmed = order.status === 'Confirmed';
    const templateFileName = isConfirmed
      ? 'Modern Professional Business invoice Template - Paid.pptx'
      : 'Modern Professional Business invoice Template.pptx';
    const templatePath = path.resolve(process.cwd(), 'public', templateFileName);
    
    if (!fs.existsSync(templatePath)) {
      return NextResponse.json({ error: 'Invoice template PPTX file is missing.' }, { status: 500 });
    }

    // 6. Manipulate PPTX in memory
    const content = fs.readFileSync(templatePath);
    const zip = new PizZip(content);

    // Clean up empty slide shapes before docxtemplater processes them
    const slideFiles = Object.keys(zip.files).filter(name => name.startsWith("ppt/slides/slide") && name.endsWith(".xml"));
    for (const slideFile of slideFiles) {
      let xml = zip.files[slideFile].asText();
      for (let i = 1; i <= 6; i++) {
        if (i > order.items.length) {
          xml = removeShapeContainingText(xml, `{{ITEM_${i}_BG}}`);
        }
      }
      zip.file(slideFile, xml);
    }

    // Run Docxtemplater on the zip structure
    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
      delimiters: {
        start: '{{',
        end: '}}'
      }
    });

    doc.setData(replacements);
    
    try {
      doc.render();
    } catch (renderError: any) {
      console.error('[Invoice API] Docxtemplater rendering error:', renderError);
      return NextResponse.json({ error: 'Failed to populate template placeholders.' }, { status: 500 });
    }

    const pptxBuffer = doc.getZip().generate({
      type: 'nodebuffer',
      compression: 'DEFLATE',
    });

    // 7. Call PDF Conversion REST endpoint
    const convertSecret = process.env.CONVERT_API_SECRET;
    const cloudmersiveKey = process.env.CLOUDMERSIVE_API_KEY;

    if (!convertSecret && !cloudmersiveKey) {
      return NextResponse.json({ 
        error: 'PDF Conversion API key is missing.', 
        details: 'Please configure CLOUDMERSIVE_API_KEY or CONVERT_API_SECRET in your environment settings.' 
      }, { status: 500 });
    }

    let pdfBuffer: Buffer;

    if (cloudmersiveKey && cloudmersiveKey !== 'your-cloudmersive-api-key' && cloudmersiveKey !== 'your_cloudmersive_api_key_here') {
      console.log(`[Invoice API] Submitting in-memory PPTX to Cloudmersive API...`);
      const formData = new FormData();
      const pptxBlob = new Blob([new Uint8Array(pptxBuffer)], { type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation' });
      formData.append('inputFile', pptxBlob, 'invoice.pptx');

      const convertRes = await fetch(`https://api.cloudmersive.com/convert/pptx/to/pdf`, {
        method: 'POST',
        headers: {
          'Apikey': cloudmersiveKey,
        },
        body: formData,
      });

      if (!convertRes.ok) {
        const errText = await convertRes.text();
        console.error('[Invoice API] Cloudmersive API error response:', errText);
        return NextResponse.json({ 
          error: 'Cloudmersive PDF Conversion failed.', 
          details: errText || 'Cloudmersive returned an error.' 
        }, { status: 502 });
      }

      pdfBuffer = Buffer.from(await convertRes.arrayBuffer());
    } else {
      console.log(`[Invoice API] Submitting in-memory PPTX to ConvertAPI...`);
      const formData = new FormData();
      const pptxBlob = new Blob([new Uint8Array(pptxBuffer)], { type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation' });
      formData.append('File', pptxBlob, 'invoice.pptx');
      formData.append('StoreFile', 'false');

      const convertRes = await fetch(`https://v2.convertapi.com/convert/pptx/to/pdf`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${convertSecret}`,
        },
        body: formData,
      });

      if (!convertRes.ok) {
        const errText = await convertRes.text();
        console.error('[Invoice API] ConvertAPI error response:', errText);
        return NextResponse.json({ 
          error: 'ConvertAPI PDF Conversion failed.', 
          details: errText || 'ConvertAPI returned an error.' 
        }, { status: 502 });
      }

      pdfBuffer = Buffer.from(await convertRes.arrayBuffer());
    }

    console.log(`[Invoice API] PDF generated successfully. Returning in-memory buffer.`);
    return new Response(new Uint8Array(pdfBuffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="Invoice-${invoiceNo}.pdf"`,
      },
    });

  } catch (error: any) {
    console.error('[Invoice API] Server error:', error);
    return NextResponse.json({ error: error.message || 'Error processing invoice request' }, { status: 500 });
  }
}
