# coritiba-conceptstore

Premium concept store for Coritiba, built as a portfolio-ready e-commerce experience with strong art direction, motion, multilingual support, fit guidance, cart/favorites flows, and post-purchase service pages.

## Stack

- Next.js 16
- React 19
- Tailwind CSS 4
- GSAP
- Zustand

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Production

```bash
npm run build
npm run start
```

## Presentation plan

The full launch and presentation strategy lives in [docs/presentation-plan.md](C:/Users/SPXBR16535/Desktop/Coritiba-antigravity-main/docs/presentation-plan.md).

## 🏗️ Arquitetura, Trade-offs e Visão de Produção

"Por ser uma concept store focada puramente na exploração de UI/UX, optei por utilizar Framer Motion e GSAP em conjunto para maximizar a fluidez das animações e entregar a experiência mais imersiva possível. Em um cenário de produção real visando alta performance e conversão (Core Web Vitals), o próximo passo arquitetural seria aplicar lazy loading (next/dynamic) e code-splitting nos componentes que dependem dessas bibliotecas pesadas. Isso reduziria drasticamente o First Load JS e otimizaria o tempo de carregamento inicial, balanceando a experiência premium com as exigências de SEO e performance web."
