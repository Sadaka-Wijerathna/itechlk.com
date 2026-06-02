import Link from "next/link";
// prop type
type IProps = {
  title: string;
  subtitle: string;
};

const Breadcrumb = ({ title, subtitle }: IProps) => {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://itechlk.com';
  
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: `${siteUrl}`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: subtitle,
        item: typeof window !== 'undefined' ? window.location.href : `${siteUrl}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <section
        className="page__title p-relative d-flex align-items-center"
        style={{ backgroundColor: '#f5f5f5' }}
      >
        <div className="container">
          <div className="row">
            <div className="col-xl-12">
              <div className="page__title-inner text-center">
                <h1>{title}</h1>
                <div className="page__title-breadcrumb">
                  <nav aria-label="breadcrumb">
                    <ol className="breadcrumb justify-content-center">
                      <li className="breadcrumb-item">
                        <Link href="/">Home</Link>
                      </li>
                      <li
                        className="breadcrumb-item active"
                        aria-current="page"
                      >
                        {subtitle}
                      </li>
                    </ol>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Breadcrumb;
