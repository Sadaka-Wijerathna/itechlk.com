import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/auth';
import { getCurrencyRates } from '@/lib/currency';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';

const execAsync = promisify(exec);

function cleanupFiles(filePaths: string[]) {
  filePaths.forEach((p) => {
    if (fs.existsSync(p)) {
      fs.unlink(p, (err) => {
        if (err) console.error(`[Invoice API] Failed to delete temp file: ${p}`, err);
      });
    }
  });
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

    // 3. Fetch currency exchange rate (USD -> LKR)
    const rates = await getCurrencyRates();
    const lkrRate = rates.LKR || 325;

    // 4. Map template placeholders
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
    const subtotalUSD = order.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const subtotalLKR = Math.round(subtotalUSD * lkrRate);
    const totalLKR = Math.round(order.totalAmount * lkrRate);
    const taxLKR = 0;

    const replacements: Record<string, string> = {
      '{{CUSTOMER_NAME}}': customerName,
      '{{EMAIL}}': email,
      '{{PHONE}}': phone,
      '{{COUNTRY}}': country,
      '{{INVOICE_DATE}}': invoiceDate,
      '{{INVOICE_NO}}': invoiceNo,
      '{{SUBTOTAL}}': `Rs. ${subtotalLKR.toLocaleString()}`,
      '{{TAX}}': `Rs. ${taxLKR.toLocaleString()}`,
      '{{TOTAL}}': `Rs. ${totalLKR.toLocaleString()}`,
    };

    // Handle invoice line items (up to 6 slots)
    for (let i = 1; i <= 6; i++) {
      const item = order.items[i - 1];
      if (item) {
        const itemTitle = `${item.title}${item.duration && item.duration !== 'N/A' ? ' / ' + item.duration : ''}`;
        const itemPriceLKR = Math.round(item.price * lkrRate);
        const itemTotalLKR = Math.round(item.price * item.quantity * lkrRate);

        replacements[`{{ITEM_${i}_NAME}}`] = itemTitle;
        replacements[`{{ITEM_${i}_PRICE}}`] = `Rs. ${itemPriceLKR.toLocaleString()}`;
        replacements[`{{item_${i}_qty}}`] = item.quantity.toString();
        replacements[`{{ITEM_${i}_TOTAL}}`] = `Rs. ${itemTotalLKR.toLocaleString()}`;
      } else {
        // Clear unused item slots
        replacements[`{{ITEM_${i}_NAME}}`] = '';
        replacements[`{{ITEM_${i}_PRICE}}`] = '';
        replacements[`{{item_${i}_qty}}`] = '';
        replacements[`{{ITEM_${i}_TOTAL}}`] = '';
      }
    }

    // 5. Setup temporary directory and files
    const tmpDir = path.resolve(process.cwd(), 'tmp');
    if (!fs.existsSync(tmpDir)) {
      fs.mkdirSync(tmpDir, { recursive: true });
    }

    const isConfirmed = order.status === 'Confirmed';
    const templateFileName = isConfirmed
      ? 'Modern Professional Business invoice Template - Paid.pptx'
      : 'Modern Professional Business invoice Template.pptx';
    const templatePath = path.resolve(process.cwd(), 'public', templateFileName);
    
    const uniqueSuffix = `${order.id}_${Date.now()}_${Math.random().toString(36).substring(3, 8)}`;
    const dataPath = path.resolve(tmpDir, `data_${uniqueSuffix}.json`);
    const tempPptxPath = path.resolve(tmpDir, `temp_${uniqueSuffix}.pptx`);
    const pdfPath = path.resolve(tmpDir, `invoice_${uniqueSuffix}.pdf`);

    if (!fs.existsSync(templatePath)) {
      return NextResponse.json({ error: 'Invoice template PPTX file is missing.' }, { status: 500 });
    }

    // Write JSON file for Python input
    await fs.promises.writeFile(dataPath, JSON.stringify(replacements, null, 2), 'utf-8');

    // 6. Execute Python script to fill PPTX and export PDF
    const pythonScriptPath = path.resolve(process.cwd(), 'scripts', 'generate_invoice.py');
    const cmd = `python "${pythonScriptPath}" "${templatePath}" "${dataPath}" "${tempPptxPath}" "${pdfPath}"`;

    try {
      await execAsync(cmd);

      // Verify PDF was generated
      if (!fs.existsSync(pdfPath)) {
        throw new Error('PDF invoice was not generated by PowerPoint script.');
      }

      // Read output PDF file buffer
      const pdfBuffer = await fs.promises.readFile(pdfPath);

      // Clean up temporary files asynchronously
      cleanupFiles([dataPath, tempPptxPath, pdfPath]);

      // Return PDF file inline
      return new Response(pdfBuffer, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `inline; filename="Invoice-${invoiceNo}.pdf"`,
        },
      });
    } catch (cmdError: any) {
      console.error('[Invoice API] Shell execution error:', cmdError);
      cleanupFiles([dataPath, tempPptxPath, pdfPath]);
      return NextResponse.json(
        {
          error: 'Failed to generate PDF invoice.',
          details: cmdError.message || cmdError,
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('[Invoice API] Server error:', error);
    return NextResponse.json({ error: error.message || 'Error processing invoice request' }, { status: 500 });
  }
}
