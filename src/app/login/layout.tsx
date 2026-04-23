import { AuthPageChrome } from "@/components/app/AuthPageChrome";

export const metadata = {
  title: "Acesso & Coxa ID - Coritiba Store",
  description: "Acesse sua conta ou vincule o Coxa ID para garantir beneficios de socio.",
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <AuthPageChrome mode="login">{children}</AuthPageChrome>;
}

