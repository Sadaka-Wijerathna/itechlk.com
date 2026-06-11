import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: 'Admin Dashboard | ITechLK Store',
    template: '%s | Admin | ITechLK Store',
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session || (session.user as any)?.role !== "admin") {
    redirect("/login");
  }

  return (
    <>
      {children}
    </>
  );
}
