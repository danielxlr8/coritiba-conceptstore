import { AuthPageChrome } from "@/components/app/AuthPageChrome";

export const metadata = {
  title: "Finalizar Compra - Coritiba Store",
  description: "Checkout seguro Coritiba Store. Compre ja os seus produtos.",
};

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthPageChrome mode="checkout">{children}</AuthPageChrome>;
}

