"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { FloatingLabelInput } from "@/components/commerce/checkout/FloatingLabelInput";
import { ShieldCheck } from "lucide-react";
import { useLocale, type Locale } from "@/components/providers/LocaleProvider";
import { repairDeepStrings } from "@/lib/utils";

type LoginTab = "store" | "coxaid";
type CoxaIdMethod = "cpf" | "email" | "cnpj";

const COXA_ID_METHODS: CoxaIdMethod[] = ["cpf", "email", "cnpj"];

const loginCopy: Record<
  Locale,
  {
    title: string;
    subtitle: string;
    storeAccess: string;
    linkCoxaId: string;
    loginTitle: string;
    email: string;
    password: string;
    forgotPassword: string;
    signIn: string;
    orContinueWith: string;
    noAccount: string;
    createAccount: string;
    registerTitle: string;
    fullName: string;
    cpf: string;
    finishRegister: string;
    backToLogin: string;
    coxaIdTitle: string;
    coxaIdDescription: string;
    memberHighlight: string;
    loginWith: string;
    coxaIdPassword: string;
    connectBenefitsManual: string;
    quickAndSecure: string;
    connectOfficialSite: string;
    forgotCoxaIdPassword: string;
  }
> = {
  pt: {
    title: "Meu Acesso",
    subtitle: "Acesse a loja ou conecte seus benefícios de sócio.",
    storeAccess: "Acesso Loja",
    linkCoxaId: "Vincular Coxa ID",
    loginTitle: "Entrar na sua conta",
    email: "E-mail",
    password: "Senha",
    forgotPassword: "Esqueceu sua senha?",
    signIn: "Entrar",
    orContinueWith: "Ou continue com",
    noAccount: "Ainda não possui conta?",
    createAccount: "Criar minha conta",
    registerTitle: "Cadastro Rápido",
    fullName: "Nome Completo",
    cpf: "CPF",
    finishRegister: "Finalizar Cadastro",
    backToLogin: "← Voltar para o Login",
    coxaIdTitle: "Vincule seu Coxa ID",
    coxaIdDescription:
      "A sua conta única de relacionamento com o Coxa. Ative agora para desbloquear o",
    memberHighlight: "Sócio Coxa até 20% OFF",
    loginWith: "Logar com:",
    coxaIdPassword: "Senha do Coxa ID",
    connectBenefitsManual: "Conectar Benefícios (Manual)",
    quickAndSecure: "Ou rápido e seguro",
    connectOfficialSite: "Conectar com Site Oficial",
    forgotCoxaIdPassword: "Esqueci a senha do Coxa ID",
  },
  en: {
    title: "My Access",
    subtitle: "Access the store or connect your membership benefits.",
    storeAccess: "Store Access",
    linkCoxaId: "Link Coxa ID",
    loginTitle: "Sign in to your account",
    email: "E-mail",
    password: "Password",
    forgotPassword: "Forgot your password?",
    signIn: "Sign In",
    orContinueWith: "Or continue with",
    noAccount: "Don't have an account yet?",
    createAccount: "Create my account",
    registerTitle: "Quick Sign Up",
    fullName: "Full Name",
    cpf: "CPF",
    finishRegister: "Complete Registration",
    backToLogin: "← Back to Login",
    coxaIdTitle: "Link your Coxa ID",
    coxaIdDescription:
      "Your single relationship account with Coxa. Activate it now to unlock",
    memberHighlight: "Coxa Member up to 20% OFF",
    loginWith: "Log in with:",
    coxaIdPassword: "Coxa ID Password",
    connectBenefitsManual: "Connect Benefits (Manual)",
    quickAndSecure: "Or quick and secure",
    connectOfficialSite: "Connect with Official Site",
    forgotCoxaIdPassword: "I forgot my Coxa ID password",
  },
  es: {
    title: "Mi Acceso",
    subtitle: "Accede a la tienda o conecta tus beneficios de socio.",
    storeAccess: "Acceso Tienda",
    linkCoxaId: "Vincular Coxa ID",
    loginTitle: "Entrar en tu cuenta",
    email: "E-mail",
    password: "Contraseña",
    forgotPassword: "¿Olvidaste tu contraseña?",
    signIn: "Entrar",
    orContinueWith: "O continúa con",
    noAccount: "¿Aún no tienes cuenta?",
    createAccount: "Crear mi cuenta",
    registerTitle: "Registro Rápido",
    fullName: "Nombre Completo",
    cpf: "CPF",
    finishRegister: "Finalizar Registro",
    backToLogin: "← Volver al Login",
    coxaIdTitle: "Vincula tu Coxa ID",
    coxaIdDescription:
      "Tu cuenta única de relación con Coxa. Actívala ahora para desbloquear",
    memberHighlight: "Socio Coxa hasta 20% OFF",
    loginWith: "Entrar con:",
    coxaIdPassword: "Contraseña de Coxa ID",
    connectBenefitsManual: "Conectar Beneficios (Manual)",
    quickAndSecure: "O rápido y seguro",
    connectOfficialSite: "Conectar con el Sitio Oficial",
    forgotCoxaIdPassword: "Olvidé la contraseña de Coxa ID",
  },
};

export default function LoginPage() {
  const { locale } = useLocale();
  const [activeTab, setActiveTab] = useState<LoginTab>("store");
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [coxaIdMethod, setCoxaIdMethod] = useState<CoxaIdMethod>("cpf");
  const copy = repairDeepStrings(loginCopy[locale]);

  return (
    <main className="flex-1 flex flex-col items-center pt-8 md:pt-16 px-4 pb-20 selection:bg-[var(--color-primary)] selection:text-black">
      <div className="w-full max-w-[480px]">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-black font-heading uppercase tracking-tight text-white">
            {copy.title} <span className="text-[var(--color-primary)]">.</span>
          </h1>
          <p className="text-sm text-white/50 mt-2">{copy.subtitle}</p>
        </div>

        <div className="flex bg-[#111] border border-white/10 rounded-[4px] p-1 mb-8">
          <button
            onClick={() => setActiveTab("store")}
            className={`flex-1 py-3 text-xs md:text-sm font-bold uppercase tracking-widest rounded-[2px] transition-all duration-300 ${
              activeTab === "store"
                ? "bg-white text-black shadow-md"
                : "text-white/40 hover:text-white"
            }`}
          >
            {copy.storeAccess}
          </button>
          <button
            onClick={() => setActiveTab("coxaid")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs md:text-sm font-bold uppercase tracking-widest rounded-[2px] transition-all duration-300 ${
              activeTab === "coxaid"
                ? "bg-[var(--color-primary)] text-black shadow-md"
                : "text-[var(--color-primary)]/50 hover:text-[var(--color-primary)]"
            }`}
          >
            {copy.linkCoxaId}
          </button>
        </div>

        <div className="relative min-h-[400px]">
          <AnimatePresence mode="wait">
            {activeTab === "store" && (
              <motion.div
                key="tab-store"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="bg-[#0A0A0A] border border-white/5 p-6 md:p-8 rounded-[4px]">
                  {authMode === "login" ? (
                    <>
                      <h2 className="text-lg font-heading font-black uppercase mb-6 text-center">
                        {copy.loginTitle}
                      </h2>
                      <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={{
                          hidden: { opacity: 0 },
                          visible: {
                            opacity: 1,
                            transition: { staggerChildren: 0.1 },
                          },
                        }}
                        className="space-y-4"
                      >
                        <motion.div
                          variants={{
                            hidden: { opacity: 0, y: 15 },
                            visible: { opacity: 1, y: 0 },
                          }}
                        >
                          <FloatingLabelInput
                            label={copy.email}
                            type="email"
                            placeholder={copy.email}
                          />
                        </motion.div>
                        <motion.div
                          variants={{
                            hidden: { opacity: 0, y: 15 },
                            visible: { opacity: 1, y: 0 },
                          }}
                        >
                          <FloatingLabelInput
                            label={copy.password}
                            type="password"
                            placeholder={copy.password}
                          />
                        </motion.div>

                        <motion.div
                          variants={{
                            hidden: { opacity: 0, y: 15 },
                            visible: { opacity: 1, y: 0 },
                          }}
                          className="flex justify-end"
                        >
                          <button className="text-xs text-white/40 hover:text-white py-2 transition-colors">
                            {copy.forgotPassword}
                          </button>
                        </motion.div>

                        <motion.button
                          variants={{
                            hidden: { opacity: 0, y: 15 },
                            visible: { opacity: 1, y: 0 },
                          }}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="w-full h-14 bg-white text-black font-black uppercase tracking-widest text-sm hover:bg-[var(--color-primary)] transition-colors rounded-[2px] mt-2"
                        >
                          {copy.signIn}
                        </motion.button>

                        <div className="flex items-center gap-4 py-4">
                          <div className="h-[1px] flex-1 bg-white/10"></div>
                          <span className="text-white/30 text-[10px] font-bold uppercase tracking-widest">
                            {copy.orContinueWith}
                          </span>
                          <div className="h-[1px] flex-1 bg-white/10"></div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center justify-center gap-2 h-12 bg-white/5 border border-white/10 text-white font-bold hover:bg-white hover:text-black hover:border-white transition-all rounded-[2px] backdrop-blur-sm text-xs uppercase tracking-widest"
                          >
                            <Image
                              src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg"
                              alt="Google"
                              width={16}
                              height={16}
                              className="bg-white rounded-full p-[2px]"
                            />
                            Google
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center justify-center gap-2 h-12 bg-white/5 border border-white/10 text-white font-bold hover:bg-white hover:text-black hover:border-white transition-all rounded-[2px] backdrop-blur-sm text-xs uppercase tracking-widest"
                          >
                            <Image
                              src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apple/apple-original.svg"
                              alt="Apple"
                              width={16}
                              height={16}
                              className="bg-white rounded-full p-[2px]"
                            />
                            Apple
                          </motion.button>
                        </div>

                        <motion.div
                          variants={{
                            hidden: { opacity: 0, y: 15 },
                            visible: { opacity: 1, y: 0 },
                          }}
                          className="pt-6 border-t border-white/10 mt-6 text-center"
                        >
                          <p className="text-xs text-white/50 mb-4">
                            {copy.noAccount}
                          </p>
                          <motion.button
                            onClick={() => setAuthMode("register")}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full h-14 bg-transparent border border-white/20 text-white font-bold uppercase tracking-widest text-sm hover:border-white transition-colors rounded-[2px]"
                          >
                            {copy.createAccount}
                          </motion.button>
                        </motion.div>
                      </motion.div>
                    </>
                  ) : (
                    <>
                      <h2 className="text-lg font-heading font-black uppercase mb-6 text-center">
                        {copy.registerTitle}
                      </h2>
                      <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={{
                          hidden: { opacity: 0 },
                          visible: {
                            opacity: 1,
                            transition: { staggerChildren: 0.1 },
                          },
                        }}
                        className="space-y-4"
                      >
                        <motion.div
                          variants={{
                            hidden: { opacity: 0, y: 15 },
                            visible: { opacity: 1, y: 0 },
                          }}
                        >
                          <FloatingLabelInput
                            label={copy.fullName}
                            type="text"
                            placeholder={copy.fullName}
                          />
                        </motion.div>
                        <motion.div
                          variants={{
                            hidden: { opacity: 0, y: 15 },
                            visible: { opacity: 1, y: 0 },
                          }}
                        >
                          <FloatingLabelInput
                            label={copy.email}
                            type="email"
                            placeholder={copy.email}
                          />
                        </motion.div>
                        <motion.div
                          variants={{
                            hidden: { opacity: 0, y: 15 },
                            visible: { opacity: 1, y: 0 },
                          }}
                        >
                          <FloatingLabelInput
                            label={copy.cpf}
                            type="text"
                            placeholder={copy.cpf}
                          />
                        </motion.div>
                        <motion.div
                          variants={{
                            hidden: { opacity: 0, y: 15 },
                            visible: { opacity: 1, y: 0 },
                          }}
                        >
                          <FloatingLabelInput
                            label={copy.password}
                            type="password"
                            placeholder={copy.password}
                          />
                        </motion.div>

                        <motion.button
                          variants={{
                            hidden: { opacity: 0, y: 15 },
                            visible: { opacity: 1, y: 0 },
                          }}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="w-full h-14 bg-white text-black font-black uppercase tracking-widest text-sm hover:bg-[var(--color-primary)] transition-colors rounded-[2px] mt-4"
                        >
                          {copy.finishRegister}
                        </motion.button>

                        <motion.div
                          variants={{
                            hidden: { opacity: 0, y: 15 },
                            visible: { opacity: 1, y: 0 },
                          }}
                          className="pt-6 text-center"
                        >
                          <button
                            onClick={() => setAuthMode("login")}
                            className="text-xs font-bold text-white/50 hover:text-white transition-colors uppercase tracking-widest"
                          >
                            {copy.backToLogin}
                          </button>
                        </motion.div>
                      </motion.div>
                    </>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === "coxaid" && (
              <motion.div
                key="tab-coxaid"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="bg-[#0A0A0A] border-2 border-[var(--color-primary)]/20 p-6 md:p-8 rounded-[4px] relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-[var(--color-primary)]/10 blur-[80px] pointer-events-none rounded-full" />

                  <div className="flex flex-col items-center mb-8 relative z-10">
                    <div className="w-16 h-16 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center mb-4 border border-[var(--color-primary)]/30">
                      <Image
                        src="https://config.fanbase.com.br/fanpage/54/img/logo.png"
                        alt="Coxa Logo"
                        width={32}
                        height={32}
                        className="opacity-90"
                      />
                    </div>
                    <h2 className="text-xl font-heading font-black uppercase text-center mb-2">
                      {copy.coxaIdTitle}
                    </h2>
                    <p className="text-xs text-white/60 text-center max-w-[280px]">
                      {copy.coxaIdDescription}{" "}
                      <strong className="text-[var(--color-primary)]">
                        {copy.memberHighlight}
                      </strong>
                      .
                    </p>
                  </div>

                  <div className="space-y-6 relative z-10">
                    <div className="flex flex-col gap-2">
                      <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold">
                        {copy.loginWith}
                      </span>
                      <div className="grid grid-cols-3 gap-2">
                        {COXA_ID_METHODS.map((method) => (
                          <button
                            key={method}
                            onClick={() => setCoxaIdMethod(method)}
                            className={`h-10 border rounded-[2px] text-xs font-bold uppercase tracking-wider transition-colors ${
                              coxaIdMethod === method
                                ? "border-[var(--color-primary)] bg-[var(--color-primary)]/10 text-white"
                                : "border-white/10 text-white/40 hover:text-white hover:border-white/30"
                            }`}
                          >
                            {method}
                          </button>
                        ))}
                      </div>
                    </div>

                    <FloatingLabelInput
                      label={coxaIdMethod.toUpperCase()}
                      type={coxaIdMethod === "email" ? "email" : "text"}
                      placeholder={coxaIdMethod.toUpperCase()}
                    />

                    <FloatingLabelInput
                      label={copy.coxaIdPassword}
                      type="password"
                      placeholder={copy.password}
                    />

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full h-14 bg-white text-black font-black uppercase tracking-widest text-sm hover:bg-[var(--color-primary)] transition-colors rounded-[2px] mt-2"
                    >
                      {copy.connectBenefitsManual}
                    </motion.button>

                    <div className="flex items-center gap-4 py-2">
                      <div className="h-[1px] flex-1 bg-white/10"></div>
                      <span className="text-white/30 text-[10px] font-bold uppercase tracking-widest">
                        {copy.quickAndSecure}
                      </span>
                      <div className="h-[1px] flex-1 bg-white/10"></div>
                    </div>

                    <motion.a
                      href="https://login.coxaid.com.br/authorize?response_type=code&scope=openid&client_id=coxaid&redirect_uri=https%3A%2F%2Fwww.coxastore.com.br%2Flogin"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full h-14 bg-[var(--color-primary)] text-black font-black uppercase tracking-widest text-sm hover:bg-white transition-colors rounded-[2px] shadow-[0_0_20px_rgba(96,232,97,0.15)] flex items-center justify-center gap-2"
                    >
                      <ShieldCheck size={18} />
                      {copy.connectOfficialSite}
                    </motion.a>

                    <div className="flex justify-center border-t border-white/5 pt-6">
                      <button className="text-[10px] text-white/30 hover:text-white uppercase tracking-widest transition-colors font-medium">
                        {copy.forgotCoxaIdPassword}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}


