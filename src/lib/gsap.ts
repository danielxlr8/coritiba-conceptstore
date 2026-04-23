// Central GSAP plugin registration — imported once in root layout.
// All components can import { gsap, ScrollTrigger } from here or from gsap directly.
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };
