"use client";

/**
 * FluidSmokeCursor — Coritiba Concept Store
 * WebGL Navier-Stokes fluid smoke simulation
 * Inspired by "Green Hell" flare atmosphere
 *
 * Palette: #ffffff (white) × #60e861 (Coritiba green)
 * Desktop only — auto-disabled on touch/mobile/tablet devices
 */

import { useEffect, useRef } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface GLProgram {
  program: WebGLProgram;
  uniforms: Record<string, WebGLUniformLocation | null>;
  bind(): void;
}

interface FBO {
  texture: WebGLTexture;
  fbo: WebGLFramebuffer;
  width: number;
  height: number;
  attach(id: number): number;
}

interface DoubleFBO {
  read: FBO;
  write: FBO;
  swap(): void;
}

interface FluidConfig {
  SIM_RESOLUTION: number;
  DYE_RESOLUTION: number;
  DENSITY_DISSIPATION: number;
  VELOCITY_DISSIPATION: number;
  PRESSURE_ITERATIONS: number;
  CURL: number;
  SPLAT_RADIUS: number;
  SPLAT_FORCE: number;
}

// ─── Shader Sources ───────────────────────────────────────────────────────────

const BASE_VERT = `
  precision highp float;
  attribute vec2 aPosition;
  varying vec2 vUv;
  varying vec2 vL;
  varying vec2 vR;
  varying vec2 vT;
  varying vec2 vB;
  uniform vec2 texelSize;
  void main () {
    vUv = aPosition * 0.5 + 0.5;
    vL = vUv - vec2(texelSize.x, 0.0);
    vR = vUv + vec2(texelSize.x, 0.0);
    vT = vUv + vec2(0.0, texelSize.y);
    vB = vUv - vec2(0.0, texelSize.y);
    gl_Position = vec4(aPosition, 0.0, 1.0);
  }
`;

const SIMPLE_VERT = `
  precision highp float;
  attribute vec2 aPosition;
  varying vec2 vUv;
  void main () {
    vUv = aPosition * 0.5 + 0.5;
    gl_Position = vec4(aPosition, 0.0, 1.0);
  }
`;

const SPLAT_FRAG = `
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D uTarget;
  uniform float aspectRatio;
  uniform vec3 color;
  uniform vec2 point;
  uniform float radius;
  void main () {
    vec2 p = vUv - point.xy;
    p.x *= aspectRatio;
    vec3 splat = exp(-dot(p, p) / radius) * color;
    vec3 base = texture2D(uTarget, vUv).xyz;
    gl_FragColor = vec4(base + splat, 1.0);
  }
`;

const ADVECTION_FRAG = `
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D uVelocity;
  uniform sampler2D uSource;
  uniform vec2 texelSize;
  uniform vec2 dyeTexelSize;
  uniform float dt;
  uniform float dissipation;
  vec4 bilerp (sampler2D sam, vec2 uv, vec2 tsize) {
    vec2 st = uv / tsize - 0.5;
    vec2 iuv = floor(st);
    vec2 fuv = fract(st);
    vec4 a = texture2D(sam, (iuv + vec2(0.5, 0.5)) * tsize);
    vec4 b = texture2D(sam, (iuv + vec2(1.5, 0.5)) * tsize);
    vec4 c = texture2D(sam, (iuv + vec2(0.5, 1.5)) * tsize);
    vec4 d = texture2D(sam, (iuv + vec2(1.5, 1.5)) * tsize);
    return mix(mix(a, b, fuv.x), mix(c, d, fuv.x), fuv.y);
  }
  void main () {
    vec2 coord = vUv - dt * bilerp(uVelocity, vUv, texelSize).xy * texelSize;
    vec4 result = bilerp(uSource, coord, dyeTexelSize);
    float decay = 1.0 + dissipation * dt;
    gl_FragColor = result / decay;
  }
`;

const DIVERGENCE_FRAG = `
  precision mediump float;
  varying highp vec2 vUv;
  varying highp vec2 vL;
  varying highp vec2 vR;
  varying highp vec2 vT;
  varying highp vec2 vB;
  uniform sampler2D uVelocity;
  void main () {
    float L = texture2D(uVelocity, vL).x;
    float R = texture2D(uVelocity, vR).x;
    float T = texture2D(uVelocity, vT).y;
    float B = texture2D(uVelocity, vB).y;
    vec2 C = texture2D(uVelocity, vUv).xy;
    if (vL.x < 0.0) { L = -C.x; }
    if (vR.x > 1.0) { R = -C.x; }
    if (vT.y > 1.0) { T = -C.y; }
    if (vB.y < 0.0) { B = -C.y; }
    float div = 0.5 * (R - L + T - B);
    gl_FragColor = vec4(div, 0.0, 0.0, 1.0);
  }
`;

const CURL_FRAG = `
  precision mediump float;
  varying highp vec2 vUv;
  varying highp vec2 vL;
  varying highp vec2 vR;
  varying highp vec2 vT;
  varying highp vec2 vB;
  uniform sampler2D uVelocity;
  void main () {
    float L = texture2D(uVelocity, vL).y;
    float R = texture2D(uVelocity, vR).y;
    float T = texture2D(uVelocity, vT).x;
    float B = texture2D(uVelocity, vB).x;
    float vorticity = R - L - T + B;
    gl_FragColor = vec4(0.5 * vorticity, 0.0, 0.0, 1.0);
  }
`;

const VORTICITY_FRAG = `
  precision highp float;
  varying vec2 vUv;
  varying vec2 vL;
  varying vec2 vR;
  varying vec2 vT;
  varying vec2 vB;
  uniform sampler2D uVelocity;
  uniform sampler2D uCurl;
  uniform float curl;
  uniform float dt;
  void main () {
    float L = texture2D(uCurl, vL).x;
    float R = texture2D(uCurl, vR).x;
    float T = texture2D(uCurl, vT).x;
    float B = texture2D(uCurl, vB).x;
    float C = texture2D(uCurl, vUv).x;
    vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
    force /= length(force) + 0.0001;
    force *= curl * C;
    force.y *= -1.0;
    vec2 vel = texture2D(uVelocity, vUv).xy;
    gl_FragColor = vec4(vel + force * dt, 0.0, 1.0);
  }
`;

const PRESSURE_FRAG = `
  precision mediump float;
  varying highp vec2 vUv;
  varying highp vec2 vL;
  varying highp vec2 vR;
  varying highp vec2 vT;
  varying highp vec2 vB;
  uniform sampler2D uPressure;
  uniform sampler2D uDivergence;
  void main () {
    float L = texture2D(uPressure, vL).x;
    float R = texture2D(uPressure, vR).x;
    float T = texture2D(uPressure, vT).x;
    float B = texture2D(uPressure, vB).x;
    float C = texture2D(uPressure, vUv).x;
    float divergence = texture2D(uDivergence, vUv).x;
    float pressure = (L + R + B + T - divergence) * 0.25;
    gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0);
  }
`;

const GRADIENT_SUBTRACT_FRAG = `
  precision mediump float;
  varying highp vec2 vUv;
  varying highp vec2 vL;
  varying highp vec2 vR;
  varying highp vec2 vT;
  varying highp vec2 vB;
  uniform sampler2D uPressure;
  uniform sampler2D uVelocity;
  void main () {
    float L = texture2D(uPressure, vL).x;
    float R = texture2D(uPressure, vR).x;
    float T = texture2D(uPressure, vT).x;
    float B = texture2D(uPressure, vB).x;
    vec2 velocity = texture2D(uVelocity, vUv).xy;
    velocity.xy -= vec2(R - L, T - B);
    gl_FragColor = vec4(velocity, 0.0, 1.0);
  }
`;

const DISPLAY_FRAG = `
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D uTexture;
  void main () {
    vec3 C = texture2D(uTexture, vUv).rgb;
    float a = max(C.r, max(C.g, C.b));
    gl_FragColor = vec4(C, a * 0.92);
  }
`;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function hexToRgb(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  return [r, g, b];
}

function compileShader(
  gl: WebGLRenderingContext,
  type: number,
  src: string,
): WebGLShader {
  const shader = gl.createShader(type)!;
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  return shader;
}

function createProgram(
  gl: WebGLRenderingContext,
  vertSrc: string,
  fragSrc: string,
  transformFeedbackVaryings?: string[],
): GLProgram {
  const vert = compileShader(gl, gl.VERTEX_SHADER, vertSrc);
  const frag = compileShader(gl, gl.FRAGMENT_SHADER, fragSrc);
  const program = gl.createProgram()!;
  gl.attachShader(program, vert);
  gl.attachShader(program, frag);
  if (transformFeedbackVaryings) {
    // WebGL1 — no transform feedback, skip
  }
  gl.linkProgram(program);
  gl.deleteShader(vert);
  gl.deleteShader(frag);

  const uniforms: Record<string, WebGLUniformLocation | null> = {};
  const uniformCount = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
  for (let i = 0; i < uniformCount; i++) {
    const info = gl.getActiveUniform(program, i);
    if (info) uniforms[info.name] = gl.getUniformLocation(program, info.name);
  }

  return {
    program,
    uniforms,
    bind() {
      gl.useProgram(program);
    },
  };
}

function createFBO(
  gl: WebGLRenderingContext,
  w: number,
  h: number,
  internalFormat: number,
  format: number,
  type: number,
  filter: number,
): FBO {
  gl.activeTexture(gl.TEXTURE0);
  const texture = gl.createTexture()!;
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, w, h, 0, format, type, null);

  const fbo = gl.createFramebuffer()!;
  gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
  gl.framebufferTexture2D(
    gl.FRAMEBUFFER,
    gl.COLOR_ATTACHMENT0,
    gl.TEXTURE_2D,
    texture,
    0,
  );
  gl.viewport(0, 0, w, h);
  gl.clear(gl.COLOR_BUFFER_BIT);

  return {
    texture,
    fbo,
    width: w,
    height: h,
    attach(id: number) {
      gl.activeTexture(gl.TEXTURE0 + id);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      return id;
    },
  };
}

function createDoubleFBO(
  gl: WebGLRenderingContext,
  w: number,
  h: number,
  internalFormat: number,
  format: number,
  type: number,
  filter: number,
): DoubleFBO {
  let fbo1 = createFBO(gl, w, h, internalFormat, format, type, filter);
  let fbo2 = createFBO(gl, w, h, internalFormat, format, type, filter);
  return {
    get read() {
      return fbo1;
    },
    get write() {
      return fbo2;
    },
    swap() {
      [fbo1, fbo2] = [fbo2, fbo1];
    },
  };
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function FluidSmokeCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // ── Touch/mobile guard ──────────────────────────────────────────────────
    if (
      typeof window === "undefined" ||
      window.matchMedia("(pointer: coarse)").matches
    ) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    // ── WebGL context ───────────────────────────────────────────────────────
    const gl = canvas.getContext("webgl", {
      alpha: true,
      depth: false,
      stencil: false,
      antialias: false,
      preserveDrawingBuffer: false,
    }) as WebGLRenderingContext;

    if (!gl) return;

    // ── Extensions ──────────────────────────────────────────────────────────
    const halfFloat =
      gl.getExtension("OES_texture_half_float") ||
      gl.getExtension("EXT_color_buffer_half_float");
    const linearFiltering =
      halfFloat && gl.getExtension("OES_texture_half_float_linear");

    const halfFloatTexType = halfFloat
      ? ((halfFloat as OES_texture_half_float).HALF_FLOAT_OES ??
        gl.UNSIGNED_BYTE)
      : gl.UNSIGNED_BYTE;

    const texFilter = linearFiltering ? gl.LINEAR : gl.NEAREST;

    // ── Config ──────────────────────────────────────────────────────────────
    const CONFIG: FluidConfig = {
      SIM_RESOLUTION: 128,
      DYE_RESOLUTION: 512,
      DENSITY_DISSIPATION: 3.2,
      VELOCITY_DISSIPATION: 2.8,
      PRESSURE_ITERATIONS: 15,
      CURL: 14,
      SPLAT_RADIUS: 0.28,
      SPLAT_FORCE: 5500,
    };

    // ── Canvas sizing ───────────────────────────────────────────────────────
    // ── Canvas sizing ───────────────────────────────────────────────────────
    const MAX_DPR = 2;
    let dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);

    function resizeCanvas() {
      dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);

      // FIX: Usa o clientWidth/Height garantindo que o WebGL não excede o DOM
      const clientW = canvas!.clientWidth || window.innerWidth;
      const clientH = canvas!.clientHeight || window.innerHeight;

      const w = Math.floor(clientW * dpr);
      const h = Math.floor(clientH * dpr);

      if (canvas!.width !== w || canvas!.height !== h) {
        canvas!.width = w;
        canvas!.height = h;
        gl!.viewport(0, 0, w, h);
      }
    }

    resizeCanvas();

    // ── Programs ────────────────────────────────────────────────────────────
    const splatProg = createProgram(gl, SIMPLE_VERT, SPLAT_FRAG);
    const advectionProg = createProgram(gl, SIMPLE_VERT, ADVECTION_FRAG);
    const divergenceProg = createProgram(gl, BASE_VERT, DIVERGENCE_FRAG);
    const curlProg = createProgram(gl, BASE_VERT, CURL_FRAG);
    const vorticityProg = createProgram(gl, BASE_VERT, VORTICITY_FRAG);
    const pressureProg = createProgram(gl, BASE_VERT, PRESSURE_FRAG);
    const gradientSubtractProg = createProgram(
      gl,
      BASE_VERT,
      GRADIENT_SUBTRACT_FRAG,
    );
    const displayProg = createProgram(gl, SIMPLE_VERT, DISPLAY_FRAG);

    // ── Quad geometry ───────────────────────────────────────────────────────
    const quadVerts = new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]);
    const quadIdx = new Uint16Array([0, 1, 2, 0, 2, 3]);
    const vertBuf = gl.createBuffer()!;
    const idxBuf = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, vertBuf);
    gl.bufferData(gl.ARRAY_BUFFER, quadVerts, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, idxBuf);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, quadIdx, gl.STATIC_DRAW);

    function bindQuad(prog: GLProgram) {
      prog.bind();
      gl.bindBuffer(gl.ARRAY_BUFFER, vertBuf);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, idxBuf);
      const loc = gl.getAttribLocation(prog.program, "aPosition");
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    }

    function blit(target: FBO | null) {
      if (target === null) {
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.viewport(0, 0, canvas!.width, canvas!.height);
      } else {
        gl.bindFramebuffer(gl.FRAMEBUFFER, target.fbo);
        gl.viewport(0, 0, target.width, target.height);
      }
      gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
    }

    // ── FBOs ────────────────────────────────────────────────────────────────
    function getResolution(res: number) {
      let aspectRatio = canvas!.width / canvas!.height;
      if (aspectRatio < 1) aspectRatio = 1 / aspectRatio;
      const max = Math.round(res * aspectRatio);
      const min = Math.round(res);
      if (canvas!.width > canvas!.height) return { width: max, height: min };
      return { width: min, height: max };
    }

    const simRes = getResolution(CONFIG.SIM_RESOLUTION);
    const dyeRes = getResolution(CONFIG.DYE_RESOLUTION);

    const RGBA = { internalFormat: gl.RGBA, format: gl.RGBA };

    let velocity = createDoubleFBO(
      gl,
      simRes.width,
      simRes.height,
      RGBA.internalFormat,
      RGBA.format,
      halfFloatTexType,
      texFilter,
    );

    let dye = createDoubleFBO(
      gl,
      dyeRes.width,
      dyeRes.height,
      RGBA.internalFormat,
      RGBA.format,
      halfFloatTexType,
      texFilter,
    );

    let divergence = createFBO(
      gl,
      simRes.width,
      simRes.height,
      RGBA.internalFormat,
      RGBA.format,
      halfFloatTexType,
      gl.NEAREST,
    );

    let curl = createFBO(
      gl,
      simRes.width,
      simRes.height,
      RGBA.internalFormat,
      RGBA.format,
      halfFloatTexType,
      gl.NEAREST,
    );

    let pressure = createDoubleFBO(
      gl,
      simRes.width,
      simRes.height,
      RGBA.internalFormat,
      RGBA.format,
      halfFloatTexType,
      gl.NEAREST,
    );

    // ── Splat ───────────────────────────────────────────────────────────────
    const WHITE = hexToRgb("#ffffff");
    const GREEN = hexToRgb("#015F2A");

    let colorToggle = false;

    function splat(x: number, y: number, dx: number, dy: number) {
      const color = colorToggle ? GREEN : WHITE;
      colorToggle = !colorToggle;

      const aspect = canvas!.width / canvas!.height;

      // Velocity splat
      bindQuad(splatProg);
      splatProg.bind();
      gl.uniform1i(splatProg.uniforms["uTarget"], velocity.read.attach(0));
      gl.uniform1f(splatProg.uniforms["aspectRatio"], aspect);
      gl.uniform2f(splatProg.uniforms["point"], x, y);
      gl.uniform3f(
        splatProg.uniforms["color"],
        dx * CONFIG.SPLAT_FORCE,
        dy * CONFIG.SPLAT_FORCE,
        0.0,
      );
      gl.uniform1f(splatProg.uniforms["radius"], CONFIG.SPLAT_RADIUS / 100.0);
      blit(velocity.write);
      velocity.swap();

      // Dye splat
      bindQuad(splatProg);
      gl.uniform1i(splatProg.uniforms["uTarget"], dye.read.attach(0));
      gl.uniform1f(splatProg.uniforms["aspectRatio"], aspect);
      gl.uniform2f(splatProg.uniforms["point"], x, y);
      gl.uniform3f(
        splatProg.uniforms["color"],
        color[0] * 0.35,
        color[1] * 0.35,
        color[2] * 0.35,
      );
      gl.uniform1f(splatProg.uniforms["radius"], CONFIG.SPLAT_RADIUS / 100.0);
      blit(dye.write);
      dye.swap();
    }

    // ── Pointer tracking ────────────────────────────────────────────────────
    // ── Pointer tracking ────────────────────────────────────────────────────
    let lastX = -1;
    let lastY = -1;
    let moved = false;

    function onMouseMove(e: MouseEvent) {
      // FIX: Lê as dimensões exatas e reais do canvas em tela
      const rect = canvas!.getBoundingClientRect();

      // Mapeia o mouse limitando estritamente à área de desenho renderizada
      const x = (e.clientX - rect.left) / rect.width;
      const y = 1.0 - (e.clientY - rect.top) / rect.height;

      // Se o rato estiver fora dos limites exatos do canvas da Hero, aborta a simulação
      if (x < 0.0 || x > 1.0 || y < 0.0 || y > 1.0) return;

      if (lastX === -1) {
        lastX = x;
        lastY = y;
        return;
      }

      const dx = (x - lastX) * 8.0;
      const dy = (y - lastY) * 8.0;

      if (Math.abs(dx) > 0.0001 || Math.abs(dy) > 0.0001) {
        splat(x, y, dx, dy);
        moved = true;
      }

      lastX = x;
      lastY = y;
    }

    window.addEventListener("mousemove", onMouseMove, { passive: true });

    // ── Simulation step ─────────────────────────────────────────────────────
    function step(dt: number) {
      gl.disable(gl.BLEND);

      const simTexelX = 1.0 / simRes.width;
      const simTexelY = 1.0 / simRes.height;
      const dyeTexelX = 1.0 / dyeRes.width;
      const dyeTexelY = 1.0 / dyeRes.height;

      // Curl
      bindQuad(curlProg);
      gl.uniform2f(curlProg.uniforms["texelSize"], simTexelX, simTexelY);
      gl.uniform1i(curlProg.uniforms["uVelocity"], velocity.read.attach(0));
      blit(curl);

      // Vorticity
      bindQuad(vorticityProg);
      gl.uniform2f(vorticityProg.uniforms["texelSize"], simTexelX, simTexelY);
      gl.uniform1i(
        vorticityProg.uniforms["uVelocity"],
        velocity.read.attach(0),
      );
      gl.uniform1i(vorticityProg.uniforms["uCurl"], curl.attach(1));
      gl.uniform1f(vorticityProg.uniforms["curl"], CONFIG.CURL);
      gl.uniform1f(vorticityProg.uniforms["dt"], dt);
      blit(velocity.write);
      velocity.swap();

      // Divergence
      bindQuad(divergenceProg);
      gl.uniform2f(divergenceProg.uniforms["texelSize"], simTexelX, simTexelY);
      gl.uniform1i(
        divergenceProg.uniforms["uVelocity"],
        velocity.read.attach(0),
      );
      blit(divergence);

      // Pressure solve
      bindQuad(pressureProg);
      gl.uniform2f(pressureProg.uniforms["texelSize"], simTexelX, simTexelY);
      gl.uniform1i(pressureProg.uniforms["uDivergence"], divergence.attach(0));
      for (let i = 0; i < CONFIG.PRESSURE_ITERATIONS; i++) {
        gl.uniform1i(
          pressureProg.uniforms["uPressure"],
          pressure.read.attach(1),
        );
        blit(pressure.write);
        pressure.swap();
      }

      // Gradient subtract
      bindQuad(gradientSubtractProg);
      gl.uniform2f(
        gradientSubtractProg.uniforms["texelSize"],
        simTexelX,
        simTexelY,
      );
      gl.uniform1i(
        gradientSubtractProg.uniforms["uPressure"],
        pressure.read.attach(0),
      );
      gl.uniform1i(
        gradientSubtractProg.uniforms["uVelocity"],
        velocity.read.attach(1),
      );
      blit(velocity.write);
      velocity.swap();

      // Advect velocity
      bindQuad(advectionProg);
      gl.uniform2f(advectionProg.uniforms["texelSize"], simTexelX, simTexelY);
      gl.uniform2f(
        advectionProg.uniforms["dyeTexelSize"],
        simTexelX,
        simTexelY,
      );
      gl.uniform1i(
        advectionProg.uniforms["uVelocity"],
        velocity.read.attach(0),
      );
      gl.uniform1i(advectionProg.uniforms["uSource"], velocity.read.attach(0));
      gl.uniform1f(advectionProg.uniforms["dt"], dt);
      gl.uniform1f(
        advectionProg.uniforms["dissipation"],
        CONFIG.VELOCITY_DISSIPATION,
      );
      blit(velocity.write);
      velocity.swap();

      // Advect dye
      bindQuad(advectionProg);
      gl.uniform2f(advectionProg.uniforms["texelSize"], simTexelX, simTexelY);
      gl.uniform2f(
        advectionProg.uniforms["dyeTexelSize"],
        dyeTexelX,
        dyeTexelY,
      );
      gl.uniform1i(
        advectionProg.uniforms["uVelocity"],
        velocity.read.attach(0),
      );
      gl.uniform1i(advectionProg.uniforms["uSource"], dye.read.attach(1));
      gl.uniform1f(advectionProg.uniforms["dt"], dt);
      gl.uniform1f(
        advectionProg.uniforms["dissipation"],
        CONFIG.DENSITY_DISSIPATION,
      );
      blit(dye.write);
      dye.swap();
    }

    // ── Render loop ─────────────────────────────────────────────────────────
    let rafId: number;
    let lastTime = performance.now();

    function render() {
      const now = performance.now();
      const dt = Math.min((now - lastTime) / 1000, 0.016);
      lastTime = now;

      step(dt);

      // Draw to screen
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport(0, 0, canvas!.width, canvas!.height);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

      bindQuad(displayProg);
      gl.uniform1i(displayProg.uniforms["uTexture"], dye.read.attach(0));
      gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);

      gl.disable(gl.BLEND);

      rafId = requestAnimationFrame(render);
    }

    rafId = requestAnimationFrame(render);

    // ── Resize ──────────────────────────────────────────────────────────────
    const ro = new ResizeObserver(() => {
      resizeCanvas();
    });
    ro.observe(document.documentElement);

    // ── Cleanup ─────────────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMouseMove);
      ro.disconnect();

      // Release WebGL resources
      gl.deleteBuffer(vertBuf);
      gl.deleteBuffer(idxBuf);
      gl.deleteTexture(velocity.read.texture);
      gl.deleteTexture(velocity.write.texture);
      gl.deleteTexture(dye.read.texture);
      gl.deleteTexture(dye.write.texture);
      gl.deleteTexture(divergence.texture);
      gl.deleteTexture(curl.texture);
      gl.deleteTexture(pressure.read.texture);
      gl.deleteTexture(pressure.write.texture);
      gl.deleteFramebuffer(velocity.read.fbo);
      gl.deleteFramebuffer(velocity.write.fbo);
      gl.deleteFramebuffer(dye.read.fbo);
      gl.deleteFramebuffer(dye.write.fbo);
      gl.deleteFramebuffer(divergence.fbo);
      gl.deleteFramebuffer(curl.fbo);
      gl.deleteFramebuffer(pressure.read.fbo);
      gl.deleteFramebuffer(pressure.write.fbo);
      gl.deleteProgram(splatProg.program);
      gl.deleteProgram(advectionProg.program);
      gl.deleteProgram(divergenceProg.program);
      gl.deleteProgram(curlProg.program);
      gl.deleteProgram(vorticityProg.program);
      gl.deleteProgram(pressureProg.program);
      gl.deleteProgram(gradientSubtractProg.program);
      gl.deleteProgram(displayProg.program);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      // FIX: Adicionado w-full e h-full para forçar o preenchimento absoluto do inset
      className="absolute inset-0 w-full h-full pointer-events-none z-[10]"
      aria-hidden="true"
      style={{ display: "block" }}
    />
  );
}
