import Wrapper from "@/layout/wrapper";
import HeaderTwo from "@/layout/headers/header-2";
import Breadcrumb from "@/components/common/breadcrumb";
import Footer from "@/layout/footers/footer";
import blog_data from "@/data/blog-data";
import BlogDetailsArea from "@/components/blogs/blog-details/blog-details-area";
import { PageParamsProps } from "@/types/custom-d-t";

export async function generateMetadata(props: PageParamsProps) {
  const resolvedParams = await props.params;
  const { id } = resolvedParams;
  const blog = blog_data.find((item) => item.id == Number(id));
  return {
    title: blog?.title ? blog.title : "Blog Details Page",
  };
}

export default async function BlogDetailsPage(props: PageParamsProps) {
  const resolvedParams = await props.params;
  const { id } = resolvedParams;
  const products = [...blog_data];
  const blog = products.find((product) => product.id === Number(id));
  return (
    <Wrapper>
      {/* header start */}
      <HeaderTwo />
      {/* header end */}

      <main>
        {/* breadcrumb start */}
        <Breadcrumb title="Blog Details" subtitle="Blog Details" />
        {/* breadcrumb end */}

        {/* blog details area start */}
        <BlogDetailsArea blog={blog!} />
        {/* blog details area end */}
      </main>

      {/* footer start */}
      <Footer />
      {/* footer end */}
    </Wrapper>
  );
}
