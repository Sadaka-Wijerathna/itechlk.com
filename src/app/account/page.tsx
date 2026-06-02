import { Metadata } from "next";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Wrapper from "@/layout/wrapper";
import HeaderTwo from "@/layout/headers/header-2";
import Breadcrumb from "@/components/common/breadcrumb";
import Footer from "@/layout/footers/footer";
import ProfileArea from "@/components/account/profile-area";
import ProfileMenuArea from "@/components/account/profile-menu-area";

export const metadata: Metadata = {
  title: "My Account",
  description: "Manage your ITechLK Store account — view orders, update profile, and manage your digital subscriptions.",
  robots: { index: false, follow: false },
};

export default async function AccountPage() {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }

  return (
    <Wrapper>
      {/* header start */}
      <HeaderTwo />
      {/* header end */}

      <main>
        {/* breadcrumb start */}
        <Breadcrumb title="Account" subtitle="Account" />
        {/* breadcrumb end */}

        {/* profile area start */}
        <ProfileArea />
        {/* profile area end */}

        {/* profile menu area start */}
        <ProfileMenuArea />
        {/* profile menu area end */}
      </main>

      {/* footer start */}
      <Footer />
      {/* footer end */}
    </Wrapper>
  );
}
