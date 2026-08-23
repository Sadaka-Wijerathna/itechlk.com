import { Metadata } from "next";
export const revalidate = 60;
import { permanentRedirect } from "next/navigation";
import Wrapper from "@/layout/wrapper";
import HeaderTwo from "@/layout/headers/header-2";
import Breadcrumb from "@/components/common/breadcrumb";
import Footer from "@/layout/footers/footer";
import ProductDetailsUpper from "@/components/product-details/product-details-upper";
import ProductDetailsBottom from "@/components/product-details/product-details-bottom";
import RelatedProducts from "@/components/products/related-products";
import { getDbProducts } from "@/lib/db-products";
import { PageParamsProps } from "@/types/custom-d-t";

export async function generateStaticParams() {
  const products = await getDbProducts();
  const params: { id: string }[] = [];
  products.forEach((product) => {
    params.push({ id: String(product.id) });
    if (product.slug) {
      params.push({ id: product.slug });
    }
  });
  return params;
}

export async function generateMetadata(props: PageParamsProps): Promise<Metadata> {
  const resolvedParams = await props.params;
  const { id } = resolvedParams;
  const product_data = await getDbProducts();
  const product = product_data.find((item) => String(item.id) === String(id) || item.slug === String(id));

  if (!product) {
    return { title: 'Product Not Found' };
  }

  const title = `Buy ${product.title} in Sri Lanka`;
  const description = product.sm_desc
    ? `${product.sm_desc} Available in Sri Lanka at ITechLK Store. Fast delivery, best prices.`
    : `Buy ${product.title} digital subscription in Sri Lanka. Best price, fast delivery at ITechLK Store.`;

  const canonicalUrl = `/product-details/${product.slug || product.id}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${product.title} | ITechLK Store`,
      description,
      url: canonicalUrl,
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
  const product = products.find((product) => String(product.id) === String(id) || product.slug === String(id));

  if (product && product.slug && String(id) === String(product.id)) {
    permanentRedirect(`/product-details/${product.slug}`);
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.itechlk.com';
  // Prices are stored in LKR — no conversion needed
  const lkrPrice = product ? Math.round(product.price) : 0;

  let aggregateRating = undefined;
  let reviews = undefined;
  
  if (product && product.reviews && product.reviews.length > 0) {
    const avgRating = product.reviews.reduce((acc, rev) => acc + rev.rating, 0) / product.reviews.length;
    aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: avgRating.toFixed(1),
      reviewCount: product.reviews.length,
    };
    
    reviews = product.reviews.map(rev => ({
      '@type': 'Review',
      reviewRating: {
        '@type': 'Rating',
        ratingValue: rev.rating
      },
      author: {
        '@type': 'Person',
        name: rev.name
      },
      reviewBody: rev.review_desc
    }));
  } else if (product && product.rating) {
    aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: product.rating.toFixed(1),
      reviewCount: 1,
    };
  }

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
      url: `${siteUrl}/product-details/${product.slug || product.id}`,
      priceCurrency: 'LKR',
      price: lkrPrice || '',
      availability: (product as any).status === 'Out of Stock'
        ? 'https://schema.org/OutOfStock'
        : 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: 'ITechLK Store',
      },
      hasMerchantReturnPolicy: {
        '@type': 'MerchantReturnPolicy',
        applicableCountry: 'LK',
        returnPolicyCategory: 'https://schema.org/MerchantReturnNotPermitted',
        url: `${siteUrl}/returns`
      },
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingRate: {
          '@type': 'MonetaryAmount',
          value: '0',
          currency: 'LKR'
        },
        shippingDestination: {
          '@type': 'DefinedRegion',
          addressCountry: 'LK'
        },
        deliveryTime: {
          '@type': 'ShippingDeliveryTime',
          handlingTime: {
            '@type': 'QuantitativeValue',
            minValue: '0',
            maxValue: '1',
            unitCode: 'd'
          },
          transitTime: {
            '@type': 'QuantitativeValue',
            minValue: '0',
            maxValue: '0',
            unitCode: 'd'
          }
        }
      }
    },
    category: (product as any).category || 'Digital Subscriptions',
    ...(aggregateRating ? { aggregateRating } : {}),
    ...(reviews ? { review: reviews } : {})
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
            <Breadcrumb title={product.title} subtitle={product.category || "Product Details"} />
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
