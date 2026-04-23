/*  -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½
   Catálogo de Produtos  - Dados raspados via Firecrawl MCP
   da Coxa Store (coxastore.com.br) em Abril/2026
   Inclui: Masculino, Feminino, Infantojuvenil, Treino, Casual
 -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ */

import { repairDeepStrings } from "@/lib/utils";

export interface ProductSpec {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  category: "uniformes" | "treino" | "casual";
  gender: "masculino" | "feminino" | "infantil";
  price: number;
  installments: string;
  discountInfo: string;
  vendor: string;
  brand: string;
  sizes: string[];
  images: string[];
  /** Imagem local usada no card de lançamentos (se existir) */
  cardImage?: string;
  description: string;
  descriptionExtra?: string;
  tagline: string;
  specs: ProductSpec[];
}

const RAW_PRODUCTS: Product[] = [
  /* ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½
     LINHA MASCULINA
  ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ */

  /*  -ï¿½ -ï¿½ 1. CAMISA JOGO 1 MASCULINA  -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ */
  {
    id: "69c7f682145302bfc27b70e9",
    slug: "camisa-jogo-1-masc",
    name: "CAMISA JOGO 1 MASC",
    subtitle: "Camisa 1 Titular - Diadora 2026",
    category: "uniformes",
    gender: "masculino",
    price: 399.99,
    installments: "ou 6x de R$ 66,67 sem juros",
    discountInfo: "Sócio Coxa tem desconto de até 20%",
    vendor: "Coxa Store",
    brand: "Diadora",
    sizes: ["P", "M", "G", "GG", "3G"],
    cardImage:
      "https://cdn.fanmarket.app.br/69cd71d48a63c01477fe57cd_camisa-jogo-1-mas.png",
    images: [
      "https://cdn.fanmarket.app.br/69cd71d48a63c01477fe57cd_camisa-jogo-1-mas.png",
      "https://cdn.fanmarket.app.br/69cd71d56e060ab3f78c9a61_camisa-jogo-1-mas.png",
      "https://cdn.fanmarket.app.br/69cd71d68a63c01477fe57ea_camisa-jogo-1-mas.png",
      "https://cdn.fanmarket.app.br/69cd71d76e060ab3f78c9a6b_camisa-jogo-1-mas.png",
      "https://cdn.fanmarket.app.br/69cd71d78a63c01477fe57f4_camisa-jogo-1-mas.png",
      "https://cdn.fanmarket.app.br/69cd71d86e060ab3f78c9a75_camisa-jogo-1-mas.png",
      "https://cdn.fanmarket.app.br/69cd71d98a63c01477fe6c78_camisa-jogo-1-mas.png",
      "https://cdn.fanmarket.app.br/69cd71da6e060ab3f78c9a7f_camisa-jogo-1-mas.png",
      "https://cdn.fanmarket.app.br/69cd71da8a63c01477fe6c82_camisa-jogo-1-mas.png",
    ],
    description:
      "Curitiba é Coritiba. E essa camisa prova isso ponto a ponto. O design da Camisa 1 Titular 2026 foi inspirado na arquitetura eclética curitibana do século 19/20. Os arcos, as curvas e os volumes que moldaram a cidade na mesma época em que o clube nasceu. A presença do verde vai além da cor: é a identidade da capital verde traduzida em manto.",
    descriptionExtra:
      "O tecido principal em jacquard botânico traz textura e movimento, com sublimação exclusiva. Os detalhes em vitral nas golas e punhos completam a referência arquitetônica e reforçam o orgulho de vestir o Coxa.",
    tagline: "Feita para jogar. Feita para usar. Feita pra quem é de Coritiba.",
    specs: [
      { label: "Composição", value: "97% Poliéster, 3% Elastano" },
      { label: "Tecido principal", value: "Jacquard botânico sublimado" },
      { label: "Escudo", value: "TPU termo aplicado  - acabamento cromo" },
      { label: "Logotipo", value: "Frieze Diadora em TPU termo aplicado" },
      { label: "Gola", value: "Retilínea com cobre gola e fita de cetim" },
      {
        label: "Detalhes",
        value: "Peitilho simples entretelado com botão personalizado Coritiba",
      },
      {
        label: "Design",
        value: "Recortes nos ombros com sublimação exclusiva",
      },
      { label: "Acabamento", value: "Barra com revel arredondado" },
      { label: "Marca", value: "Diadora" },
    ],
  },

  /*  -ï¿½ -ï¿½ 2. CAMISA GOLEIRO 1 MASCULINA  -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ */
  {
    id: "69c7f67a3a72baeb289f6e89",
    slug: "camisa-goleiro-1-masc",
    name: "CAMISA GOLEIRO 1 MASC",
    subtitle: "Camisa Goleiro Titular - Diadora 2026",
    category: "uniformes",
    gender: "masculino",
    price: 399.99,
    installments: "ou 6x de R$ 66,67 sem juros",
    discountInfo: "Sócio Coxa tem desconto de até 20%",
    vendor: "Coxa Store",
    brand: "Diadora",
    sizes: ["P", "M", "G", "GG", "3G"],
    cardImage:
      "https://cdn.fanmarket.app.br/69cd716a6e060ab3f78a9245_camisa-goleiro-1-mas.png",
    images: [
      "https://cdn.fanmarket.app.br/69cd71698a63c01477fc5046_camisa-goleiro-1-mas.png",
      "https://cdn.fanmarket.app.br/69cd71696e060ab3f78a923b_camisa-goleiro-1-mas.png",
      "https://cdn.fanmarket.app.br/69c91c03e039ef33fb1528be_camisa-goleiro-1-mas.png",
      "https://cdn.fanmarket.app.br/69c91c04e039ef33fb1528c8_camisa-goleiro-1-mas.png",
      "https://cdn.fanmarket.app.br/69c91c0569231ba67ed43211_camisa-goleiro-1-mas.png",
      "https://cdn.fanmarket.app.br/69c91c06e039ef33fb1528e7_camisa-goleiro-1-mas.png",
      "https://cdn.fanmarket.app.br/69c91c0769231ba67ed4469d_camisa-goleiro-1-mas.png",
      "https://cdn.fanmarket.app.br/69c91c07e039ef33fb1528f1_camisa-goleiro-1-mas.png",
    ],
    description:
      "Defender as cores do Coxa exige uma camisa à altura. A Camisa Goleiro 1 2026 foi pensada para oferecer liberdade total de movimento, com corte atlético e tecidos de alta performance em combinação, jacquard liso na frente e soft rider nas costas e mangas, garantindo leveza onde mais se precisa.",
    descriptionExtra:
      "O design carrega o mesmo DNA da coleção: inspirado na arquitetura eclética de Curitiba, com filetes verticais que percorrem a peça da barra ao ombro, reforçando a verticalidade e a presença do goleiro em campo. Curitiba é Coritiba, e isso aparece até no detalhe da fábrica interna.",
    tagline: "Feita para defender. Feita pra quem é de Coritiba.",
    specs: [
      { label: "Composição", value: "97% Poliéster, 4% Elastano" },
      { label: "Composição costas/mangas", value: "100% Poliéster" },
      { label: "Tecido frente", value: "Jacquard liso sublimado" },
      { label: "Tecido costas/mangas", value: "Soft Rider sublimado" },
      { label: "Escudo", value: "TPU termo aplicado  - acabamento cromo" },
      { label: "Logotipo", value: "Frieze Diadora em plotter siliconado" },
      {
        label: "Design",
        value: "Filetes verticais da barra ao recorte do ombro",
      },
      { label: "Punhos", value: "Em molde com pesponto" },
      { label: "Acabamento", value: "Bainha tubular" },
      { label: "Marca", value: "Diadora" },
    ],
  },

  /* ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½
     LINHA FEMININA
  ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ */

  /*  -ï¿½ -ï¿½ 3. CAMISA JOGO 1 FEMININA  -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ */
  {
    id: "69c7f693145302bfc27b8561",
    slug: "camisa-jogo-1-fem",
    name: "CAMISA JOGO 1 FEM",
    subtitle: "Camisa 1 Titular Feminina  - Diadora 2026",
    category: "uniformes",
    gender: "feminino",
    price: 379.99,
    installments: "ou 6x de R$ 63,33 sem juros",
    discountInfo: "Sócio Coxa tem desconto de até 20%",
    vendor: "Coxa Store",
    brand: "Diadora",
    sizes: ["P", "M", "G", "GG", "3G"],
    cardImage:
      "https://cdn.fanmarket.app.br/69cd70e68a63c01477fa4660_camisa-jogo-1-fem.png",
    images: [
      "https://cdn.fanmarket.app.br/69cd70e66e060ab3f7889cd5_camisa-jogo-1-fem.png",
      "https://cdn.fanmarket.app.br/69cd70e78a63c01477fa466a_camisa-jogo-1-fem.png",
      "https://cdn.fanmarket.app.br/69cd70e98a63c01477fa4674_camisa-jogo-1-fem.png",
      "https://cdn.fanmarket.app.br/69cd70e86e060ab3f7889cdf_camisa-jogo-1-fem.png",
      "https://cdn.fanmarket.app.br/69c863ffe810c57450f23eb3_camisa-jogo-1-fem.png",
      "https://cdn.fanmarket.app.br/69c864002a35aa109ae8dc22_camisa-jogo-1-fem.png",
      "https://cdn.fanmarket.app.br/69c86401e810c57450f23ebd_camisa-jogo-1-fem.png",
      "https://cdn.fanmarket.app.br/69cd70e96e060ab3f7889ce9_camisa-jogo-1-fem.png",
    ],
    description:
      "Curitiba é Coritiba. E essa camisa prova isso ponto a ponto. O design da Camisa 1 Titular 2026 foi inspirado na arquitetura eclética curitibana do século 19/20. Os arcos, as curvas e os volumes que moldaram a cidade na mesma época em que o clube nasceu. A presença do verde vai além da cor: é a identidade da capital verde traduzida em manto.",
    descriptionExtra:
      "O tecido principal em jacquard botânico traz textura e movimento, com sublimação exclusiva. Os detalhes em vitral nas golas e punhos completam a referência arquitetônica e reforçam o orgulho de vestir o Coxa.",
    tagline: "Feita para jogar. Feita para usar. Feita pra quem é de Coritiba.",
    specs: [
      { label: "Composição", value: "97% Poliéster, 3% Elastano" },
      { label: "Tecido principal", value: "Jacquard botânico sublimado" },
      { label: "Escudo", value: "TPU termo aplicado  - acabamento cromo" },
      { label: "Logotipo", value: "Frieze Diadora em TPU termo aplicado" },
      { label: "Gola", value: "Retilínea com cobre gola e fita de cetim" },
      {
        label: "Detalhes",
        value: "Peitilho simples entretelado com botão personalizado Coritiba",
      },
      {
        label: "Design",
        value: "Recortes nos ombros com sublimação exclusiva",
      },
      { label: "Acabamento", value: "Barra com revel arredondado" },
      { label: "Marca", value: "Diadora" },
    ],
  },

  /*  -ï¿½ -ï¿½ 4. CAMISA GOLEIRO 1 FEMININA  -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ */
  {
    id: "69c7f669145302bfc27b31ec",
    slug: "camisa-goleiro-1-fem",
    name: "CAMISA GOLEIRO 1 FEM",
    subtitle: "Camisa Goleiro Titular Feminina  - Diadora 2026",
    category: "uniformes",
    gender: "feminino",
    price: 379.99,
    installments: "ou 6x de R$ 63,33 sem juros",
    discountInfo: "Sócio Coxa tem desconto de até 20%",
    vendor: "Coxa Store",
    brand: "Diadora",
    sizes: ["P", "M", "G", "GG", "3G"],
    cardImage:
      "https://cdn.fanmarket.app.br/69cd71ae8a63c01477fd7506_camisa-goleiro-1-fem.png",
    images: [
      "https://cdn.fanmarket.app.br/69cd71ae6e060ab3f78b789f_camisa-goleiro-1-fem.png",
      "https://cdn.fanmarket.app.br/69cd71ad6e060ab3f78b7895_camisa-goleiro-1-fem.png",
      "https://cdn.fanmarket.app.br/69cd71ae8a63c01477fd7506_camisa-goleiro-1-fem.png",
      "https://cdn.fanmarket.app.br/69c91c65e039ef33fb159907_camisa-goleiro-1-fem.png",
      "https://cdn.fanmarket.app.br/69c91c6669231ba67ed48a7b_camisa-goleiro-1-fem.png",
      "https://cdn.fanmarket.app.br/69c91c67e039ef33fb159911_camisa-goleiro-1-fem.png",
      "https://cdn.fanmarket.app.br/69c91c6869231ba67ed48a85_camisa-goleiro-1-fem.png",
      "https://cdn.fanmarket.app.br/69c91c69e039ef33fb15991b_camisa-goleiro-1-fem.png",
      "https://cdn.fanmarket.app.br/69c91c6969231ba67ed48a8f_camisa-goleiro-1-fem.png",
      "https://cdn.fanmarket.app.br/69c91c6ae039ef33fb159925_camisa-goleiro-1-fem.png",
      "https://cdn.fanmarket.app.br/69c91c6b69231ba67ed48a99_camisa-goleiro-1-fem.png",
      "https://cdn.fanmarket.app.br/69c91c6ce039ef33fb15992f_camisa-goleiro-1-fem.png",
    ],
    description:
      "Defender as cores do Coxa exige uma camisa à altura. A Camisa Goleiro 1 2026 foi pensada para oferecer liberdade total de movimento, com corte atlético e tecidos de alta performance em combinação, jacquard liso na frente e soft rider nas costas e mangas, garantindo leveza onde mais se precisa.",
    descriptionExtra:
      "O design carrega o mesmo DNA da coleção: inspirado na arquitetura eclética de Curitiba, com filetes verticais que percorrem a peça da barra ao ombro, reforçando a verticalidade e a presença do goleiro em campo.",
    tagline: "Feita para defender. Feita pra quem é de Coritiba.",
    specs: [
      { label: "Composição", value: "97% Poliéster, 4% Elastano" },
      { label: "Composição costas/mangas", value: "100% Poliéster" },
      { label: "Tecido frente", value: "Jacquard liso sublimado" },
      { label: "Tecido costas/mangas", value: "Soft Rider sublimado" },
      { label: "Escudo", value: "TPU termo aplicado  - acabamento cromo" },
      { label: "Logotipo", value: "Frieze Diadora em plotter siliconado" },
      {
        label: "Design",
        value: "Filetes verticais da barra ao recorte do ombro",
      },
      { label: "Punhos", value: "Em molde com pesponto" },
      { label: "Acabamento", value: "Bainha tubular" },
      { label: "Marca", value: "Diadora" },
    ],
  },

  /* ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½
     LINHA INFANTOJUVENIL  P  (raspada via Firecrawl)
  ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ */

  /*  -ï¿½ -ï¿½ 5. CAMISA JOGO 1 INF/JUV  -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ */
  {
    id: "69c7f68d3a72baeb289f9a04",
    slug: "camisa-jogo-1-infjuv",
    name: "CAMISA JOGO 1 INF/JUV",
    subtitle: "Camisa 1 Titular Infantojuvenil  - Diadora 2026",
    category: "uniformes",
    gender: "infantil",
    price: 359.99,
    installments: "ou 6x de R$ 60,00 sem juros",
    discountInfo: "Sócio Coxa tem desconto de até 20%",
    vendor: "Coxa Store",
    brand: "Diadora",
    sizes: ["4", "6", "8", "10", "12", "14"],
    images: [
      "https://cdn.fanmarket.app.br/69c91bd1e039ef33fb14fe33_camisa-jogo-1-infjuv.png",
      "https://cdn.fanmarket.app.br/69c91bd369231ba67ed3ef77_camisa-jogo-1-infjuv.png",
      "https://cdn.fanmarket.app.br/69c91bd3e039ef33fb14fe3d_camisa-jogo-1-infjuv.png",
      "https://cdn.fanmarket.app.br/69c91bd469231ba67ed3ef81_camisa-jogo-1-infjuv.png",
      "https://cdn.fanmarket.app.br/69c91bd5e039ef33fb14fe47_camisa-jogo-1-infjuv.png",
      "https://cdn.fanmarket.app.br/69c91bd669231ba67ed3ef8b_camisa-jogo-1-infjuv.png",
      "https://cdn.fanmarket.app.br/69c91bd7e039ef33fb14fe51_camisa-jogo-1-infjuv.png",
      "https://cdn.fanmarket.app.br/69c91bd769231ba67ed3ef95_camisa-jogo-1-infjuv.png",
    ],
    description:
      "Curitiba é Coritiba. E essa camisa prova isso ponto a ponto. O design da Camisa 1 Titular 2026 foi inspirado na arquitetura eclética curitibana do século 19/20. Os arcos, as curvas e os volumes que moldaram a cidade na mesma época em que o clube nasceu. A presença do verde vai além da cor: é a identidade da capital verde traduzida em manto.",
    descriptionExtra:
      "O tecido principal em jacquard botânico traz textura e movimento, com sublimação exclusiva. Os detalhes em vitral nas golas e punhos completam a referência arquitetônica e reforçam o orgulho de vestir o Coxa.",
    tagline: "Desde pequeninhos, Coxa no coração.",
    specs: [
      { label: "Composição", value: "97% Poliéster, 3% Elastano" },
      { label: "Tecido principal", value: "Jacquard botânico sublimado" },
      { label: "Escudo", value: "TPU termo aplicado  - acabamento cromo" },
      { label: "Logotipo", value: "Frieze Diadora em TPU termo aplicado" },
      { label: "Gola", value: "Retilínea com cobre gola e fita de cetim" },
      {
        label: "Detalhes",
        value: "Peitilho simples entretelado com botão personalizado Coritiba",
      },
      {
        label: "Design",
        value: "Recortes nos ombros com sublimação exclusiva",
      },
      { label: "Acabamento", value: "Barra com revel arredondado" },
      { label: "Tamanhos", value: "4, 6, 8, 10, 12, 14" },
      { label: "Marca", value: "Diadora" },
    ],
  },

  /*  -ï¿½ -ï¿½ 6. CAMISA GOLEIRO 1 INF/JUV  -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ */
  {
    id: "69c7f673145302bfc27b5ccf",
    slug: "camisa-goleiro-1-infjuv",
    name: "CAMISA GOLEIRO 1 INF/JUV",
    subtitle: "Camisa Goleiro Titular Infantojuvenil  - Diadora 2026",
    category: "uniformes",
    gender: "infantil",
    price: 359.99,
    installments: "ou 6x de R$ 60,00 sem juros",
    discountInfo: "Sócio Coxa tem desconto de até 20%",
    vendor: "Coxa Store",
    brand: "Diadora",
    sizes: ["4", "6", "8", "10", "12", "14"],
    images: [
      "https://cdn.fanmarket.app.br/69c91c3269231ba67ed45c6f_camisa-goleiro-1-infjuv.png",
      "https://cdn.fanmarket.app.br/69c91c33e039ef33fb156b12_camisa-goleiro-1-infjuv.png",
      "https://cdn.fanmarket.app.br/69c91c3469231ba67ed45c79_camisa-goleiro-1-infjuv.png",
      "https://cdn.fanmarket.app.br/69c91c35e039ef33fb156b1c_camisa-goleiro-1-infjuv.png",
      "https://cdn.fanmarket.app.br/69c91c3669231ba67ed45c84_camisa-goleiro-1-infjuv.png",
      "https://cdn.fanmarket.app.br/69c91c37e039ef33fb156b26_camisa-goleiro-1-infjuv.png",
      "https://cdn.fanmarket.app.br/69c91c3769231ba67ed45c8e_camisa-goleiro-1-infjuv.png",
      "https://cdn.fanmarket.app.br/69c91c38e039ef33fb156b30_camisa-goleiro-1-infjuv.png",
      "https://cdn.fanmarket.app.br/69c91c3969231ba67ed45ccb_camisa-goleiro-1-infjuv.png",
    ],
    description:
      "Defender as cores do Coxa exige uma camisa à altura, mesmo para os mais novos torcedores. A Camisa Goleiro 1 INF/JUV 2026 é a versão especial para a garotada que já sonha em defender o gol do Coxa. O mesmo design vibrante e DNA arquitetônico de Curitiba, no tamanho certo para os campeões do futuro.",
    descriptionExtra:
      "Corte atlético adaptado para os menores, com tecido soft rider nas costas e mangas para garantir leveza e conforto máximos. O design carrega filetes verticais que percorrem a peça da barra ao ombro.",
    tagline: "O futuro do Coxa começa aqui.",
    specs: [
      { label: "Composição", value: "97% Poliéster, 4% Elastano" },
      { label: "Composição costas e mangas", value: "100% Poliéster" },
      { label: "Tecido frente", value: "Jacquard liso sublimado" },
      { label: "Tecido costas/mangas", value: "Soft Rider sublimado" },
      { label: "Escudo", value: "TPU termo aplicado  - acabamento cromo" },
      { label: "Frieze", value: "Diadora em plotter siliconado" },
      { label: "Design", value: "Filetes verticais da barra ao ombro" },
      { label: "Punhos", value: "Em molde com pesponto" },
      { label: "Acabamento", value: "Bainha tubular" },
      { label: "Tamanhos", value: "4, 6, 8, 10, 12, 14" },
      { label: "Marca", value: "Diadora" },
    ],
  },

  /* ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½
     LINHA TREINO & CASUAL (complementar)
  ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ï¿½"ï¿½ */

  /*  -ï¿½ -ï¿½ 7. CAMISA TREINO 1 MASCULINA  -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ */
  {
    id: "treino-01",
    slug: "camisa-treino-1-mas",
    name: "CAMISA TREINO 1 MAS",
    subtitle: "Camisa Treino  - Diadora 2026",
    category: "treino",
    gender: "masculino",
    price: 249.99,
    installments: "ou 4x de R$ 62,50 sem juros",
    discountInfo: "Sócio Coxa tem desconto de até 20%",
    vendor: "Coxa Store",
    brand: "Diadora",
    sizes: ["P", "M", "G", "GG", "3G"],
    images: [
      "https://cdn.fanmarket.app.br/69c863e72a35aa109ae884d4_camisa-jogo-1-mas.png",
      "https://cdn.fanmarket.app.br/69c863e8e810c57450f23d92_camisa-jogo-1-mas.png",
    ],
    description:
      "Criada para maximizar o desempenho nos treinos. Tecido hiper leve com furos a laser para ventilação e secagem rápida.",
    tagline: "Respire. Corra. Treine.",
    specs: [{ label: "Tecido", value: "Dry-fit aerado" }],
  },

  /*  -ï¿½ -ï¿½ 8. AGASALHO VIAGEM MASCULINO  -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ */
  {
    id: "viagem-01",
    slug: "agasalho-viagem-mas",
    name: "BLUSA VIAGEM MAS",
    subtitle: "Blusa Viagem Hino  - Diadora 2026",
    category: "casual",
    gender: "masculino",
    price: 499.99,
    installments: "ou 6x de R$ 83,33 sem juros",
    discountInfo: "Sócio Coxa tem desconto de até 20%",
    vendor: "Coxa Store",
    brand: "Diadora",
    sizes: ["M", "G", "GG"],
    images: ["/images/products/product-jacket1.webp"],
    description:
      "Estilo e conforto para os dias frios de Curitiba. Tecido premium de poliamida com elastano.",
    tagline: "Elegância ao máximo.",
    specs: [{ label: "Tecido", value: "Poliamida com Elastano" }],
  },

  /*  -ï¿½ -ï¿½ 9. CAMISA TREINO 1 FEMININA  -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ */
  {
    id: "treino-02",
    slug: "camisa-treino-1-fem",
    name: "CAMISA TREINO 1 FEM",
    subtitle: "Camisa Treino Feminina  - Diadora 2026",
    category: "treino",
    gender: "feminino",
    price: 239.99,
    installments: "ou 4x de R$ 59,99 sem juros",
    discountInfo: "Sócio Coxa tem desconto de até 20%",
    vendor: "Coxa Store",
    brand: "Diadora",
    sizes: ["P", "M", "G", "GG"],
    images: [
      "https://cdn.fanmarket.app.br/69c863fbe810c57450f23e9f_camisa-jogo-1-fem.png",
      "https://cdn.fanmarket.app.br/69c863fc2a35aa109ae8dc00_camisa-jogo-1-fem.png",
    ],
    description:
      "Alta respirabilidade e modelagem ajustada para o treino feminino. Secagem rápida e liberdade de movimento.",
    tagline: "Feita para não parar.",
    specs: [{ label: "Tecido", value: "Poliéster Reciclado" }],
  },

  /*  -ï¿½ -ï¿½ 10. MOLETOM CASUAL  -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ */
  {
    id: "casual-01",
    slug: "moletom-casual-mas",
    name: "Camisa Coritiba Oficial Jogo 3 Masculino Verde e Branco",
    subtitle: "Terceira camisa Coritiba",
    category: "casual",
    gender: "masculino",
    price: 509.99,
    installments: "ou 5x de R$ 69,99 sem juros",
    discountInfo: "Sócio Coxa tem desconto de 15%",
    vendor: "Coxa Store",
    brand: "Coritiba Oficial",
    sizes: ["P", "M", "G", "XG"],
    images: [
      "/images/products/product-jersey-3-front.webp",
      "/images/products/product-jersey-3-back.webp",
      "/images/products/product-jersey-3-side.webp",
    ],
    description:
      "Apresentamos a Camisa Coritiba Oficial Jogo 3 Masculino Branco e Verde, uma peça exclusiva para torcedores que desejam demonstrar seu amor pelo Coritiba Foot Ball Club. Confeccionada em poliéster de alta qualidade, esta camisa oferece conforto, leveza e respirabilidade, ideal para acompanhar os jogos ou usar no dia a dia. Com design moderno que integra as cores branco e verde, ela representa com autenticidade a tradição do clube. ",
    tagline: "Camisa de Time.",
    specs: [{ label: "Tecido", value: "Poliéster" }],
  },
];

export const PRODUCTS: Product[] = repairDeepStrings(RAW_PRODUCTS);

/*  -ï¿½ -ï¿½ Helpers  -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ -ï¿½ */

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function getProductById(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}

export function getProductsByCategory(
  category: Product["category"],
): Product[] {
  return PRODUCTS.filter((p) => p.category === category);
}

export function getProductsByGender(gender: Product["gender"]): Product[] {
  return PRODUCTS.filter((p) => p.gender === gender);
}
