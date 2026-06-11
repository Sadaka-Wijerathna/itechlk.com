import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reset Password | ITechLK Store",
  description: "Reset your ITechLK Store account password.",
  robots: { index: false, follow: false },
};

export default function ResetPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
