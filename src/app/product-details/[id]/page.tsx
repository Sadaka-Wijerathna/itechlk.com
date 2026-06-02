import { Metadata } from "next";
export const dynamic = 'force-dynamic';
import Wrapper from "@/layout/wrapper";
import HeaderTwo from "@/layout/headers/header-2";
import Breadcrumb from "@/components/common/breadcrumb";
import Footer from "@/layout/footers/footer";
import ProductDetailsUpper from "@/components/product-details/product-details-upper";
import ProductDetailsBottom from "@/components/product-details/product-details-bottom";
import RelatedProducts from "@/components/products/related-products";
import { getDbProducts } from "@/lib/db-products";
import { PageParamsProps } from "@/types/custom-d-t";

export async function generateMetadata(props: PageParamsProps): Promise<Metadata> {
  const resolvedParams = await props.params;
  const { id } = resolvedParams;
  const product_data = await getDbProducts();
  const product = product_data.find((item) => String(item.id) === String(id));

  if (!product) {
    return { title: 'Product Not Found' };
  }

  const title = `Buy ${product.title} in Sri Lanka`;
  const description = product.sm_desc
    ? `${product.sm_desc} Available in Sri Lanka at ITechLK Store. Fast delivery, best prices.`
    : `Buy ${product.title} digital subscription in Sri Lanka. Best price, fast delivery at ITechLK Store.`;

  return {
    title,
    description,
    alternates: {
      canonical: `/product-details/${id}`,
    },
    openGraph: {
      title: `${product.title} | ITechLK Store`,
      description,
      url: `/product-details/${id}`,
      type: 'website',
      images: product.img ? [{ url: product.img, alt: product.title }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.title} | ITechLK Store`,
      description,
      images: product.img ? [product.img] : [],
    },
  };
}

export default async function ProductDetailsPage(props: PageParamsProps) {
  const resolvedParams = await props.params;
  const { id } = resolvedParams;
  const products = await getDbProducts();
  const product = products.find((product) => String(product.id) === String(id));

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://itechlk.com';

  const productJsonLd = product ? {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.sm_desc || `${product.title} digital subscription available in Sri Lanka.`,
    image: product.img ? (product.img.startsWith('http') ? product.img : `${siteUrl}${product.img}`) : `${siteUrl}/assets/img/logo/logo.png`,
    sku: String(product.id),
    brand: {
      '@type': 'Brand',
      name: 'ITechLK Store',
    },
    offers: {
      '@type': 'Offer',
      url: `${siteUrl}/product-details/${product.id}`,
      priceCurrency: 'LKR',
      price: (product as any).price || (product as any).priceRange || '',
      availability: (product as any).status === 'Out of Stock'
        ? 'https://schema.org/OutOfStock'
        : 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: 'ITechLK Store',
      },
    },
    category: (product as any).category || 'Digital Subscriptions',
  } : null;

  return (
    <Wrapper>
      {product && productJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
        />
      )}
      {product ? (
        <>
          {/* header start */}
          <HeaderTwo />
          {/* header end */}

          <main>
            {/* breadcrumb start */}
            <Breadcrumb title="Product Details" subtitle="Product Details" />
            {/* breadcrumb end */}

            {/* shop details upper area start */}
            <section className="shop__area pb-65">
              <div className="shop__top grey-bg-6 pt-100 pb-90">
                <div className="container">
                  <ProductDetailsUpper product={product} />
                </div>
              </div>
              <ProductDetailsBottom product={product} />
            </section>
            {/* shop details upper area end */}

            {/* related products start */}
            <RelatedProducts product_data={products} product={product} />
            {/* related products end */}
          </main>

          {/* footer start */}
          <Footer />
          {/* footer end */}
        </>
      ) : (
        <div className="text-center" style={{ height: "100vh" }}>
          <h2>Product Not Found Id : {id}</h2>
        </div>
      )}
    </Wrapper>
  );
}
