import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forgot Password | ITechLK Store",
  description: "Request a password reset link for your ITechLK Store account.",
  robots: { index: false, follow: false },
};

export default function ForgotPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
