import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import bonfireImg from "../assets/bonfire-hero.jpg";
import bonfireAudio from "../assets/bonfire.mp3";
import "./Hero.css";

const NOISE_GLSL = `
  vec3 _m289(vec3 x){return x-floor(x*(1./289.))*289.;}
  vec2 _m289(vec2 x){return x-floor(x*(1./289.))*289.;}
  vec3 _prm(vec3 x){return _m289((x*34.+1.)*x);}
  float snoise(vec2 v){
    const vec4 C=vec4(.211324865,.366025404,-.577350269,.024390244);
    vec2 i=floor(v+dot(v,C.yy)),x0=v-i+dot(i,C.xx);
    vec2 i1=(x0.x>x0.y)?vec2(1,0):vec2(0,1);
    vec4 x12=x0.xyxy+C.xxzz;x12.xy-=i1;i=_m289(i);
    vec3 p=_prm(_prm(i.y+vec3(0,i1.y,1))+i.x+vec3(0,i1.x,1));
    vec3 m=max(.5-vec3(dot(x0,x0),dot(x12.xy,x12.xy),dot(x12.zw,x12.zw)),0.);
    m=m*m*m*m;
    vec3 x2=2.*fract(p*C.www)-1.,h=abs(x2)-.5,ox=floor(x2+.5),a0=x2-ox;
    m*=1.79284291-.85373472*(a0*a0+h*h);
    vec3 g;g.x=a0.x*x0.x+h.x*x0.y;g.yz=a0.yz*x12.xz+h.yz*x12.yw;
    return 130.*dot(m,g);
  }
`;

const vertSrc = `
  attribute float aSeed; attribute float aSize;
  attribute float aSpeed; attribute float aPhase; attribute float aSpawnX;
  uniform float uTime; uniform float uWindX; uniform float uWindY;
  varying vec2 vUv; varying float vLife; varying float vSeed;
  float h(float n){return fract(sin(n)*43758.5453);}
  void main(){
    float t=uTime*aSpeed+aPhase, life=mod(t,1.0);
    vLife=life; vSeed=aSeed; vUv=position.xy+0.5;
    float rise=pow(life,0.70)*(0.72+h(aSeed+2.)*0.32);
    float fan=(h(aSeed+1.)-0.5)*0.10*life;
    float wLean=uWindX*life*life*0.28;
    float osc=sin(uTime*1.8*aSpeed+aSeed*6.28)*0.018*life;
    vec3 wPos=vec3(aSpawnX+fan+wLean+osc,rise+uWindY*life*0.06,0.0);
    float sz=aSize*pow(1.0-life,0.80);
    wPos.xy+=position.xy*sz*vec2(0.9,1.8);
    gl_Position=projectionMatrix*modelViewMatrix*vec4(wPos,1.0);
  }
`;

const fragSrc = `
  ${NOISE_GLSL}
  uniform float uTime; uniform float uWindX;
  varying vec2 vUv; varying float vLife; varying float vSeed;
  vec3 fireColor(float v){
    vec3 c=vec3(0.0);
    c=mix(c,vec3(0.55,0.00,0.00),smoothstep(0.00,0.28,v));
    c=mix(c,vec3(1.00,0.22,0.00),smoothstep(0.22,0.42,v));
    c=mix(c,vec3(1.00,0.58,0.02),smoothstep(0.36,0.56,v));
    c=mix(c,vec3(1.00,0.88,0.26),smoothstep(0.50,0.70,v));
    c=mix(c,vec3(1.00,1.00,0.80),smoothstep(0.66,0.86,v));
    c=mix(c,vec3(1.00,1.00,1.00),smoothstep(0.84,1.00,v));
    return c;
  }
  void main(){
    vec2 uv=vUv; uv.x+=uWindX*0.08*uv.y;
    float spd1=1.20+vSeed*0.30;
    vec2 uv1=vec2(uv.x*1.4,uv.y*2.6-uTime*spd1);
    float spd2=0.80+vSeed*0.20;
    vec2 uv2=vec2(uv.x*3.2+0.4,uv.y*4.8-uTime*spd2+vSeed*2.1);
    float n1=snoise(uv1)*0.5+0.5;
    float n2=snoise(uv2)*0.5+0.5;
    float n3=snoise(uv1+vec2(n2*0.35-0.175,n2*0.25-0.125))*0.5+0.5;
    float noise=n1*0.40+n3*0.60;
    vec2 ctr=uv-0.5;
    float distE=length(ctr*vec2(2.2,1.0));
    float mask=1.0-smoothstep(0.22,0.50,distE);
    float heat=(1.0-uv.y)*0.25;
    float intensity=clamp(noise*mask+heat*mask,0.0,1.0);
    intensity=pow(intensity,1.35);
    float fade=pow(1.0-vLife,1.10)*smoothstep(0.0,0.06,vLife);
    vec3 col=fireColor(intensity);
    float alpha=smoothstep(0.0,0.20,intensity)*mask*fade;
    gl_FragColor=vec4(col*alpha,alpha*0.60);
  }
`;

const embVertSrc = `
  attribute float aSize; attribute float aLife; attribute float aSpeed; attribute float aSeed;
  uniform float uTime; uniform float uWindX; uniform float uWindY;
  varying float vAlpha; varying float vLife;
  float h(float n){return fract(sin(n)*43758.5453);}
  void main(){
    float t=uTime*aSpeed+aSeed*6.283,life=mod(t,1.0);
    vLife=life; vAlpha=pow(1.-life,1.4)*smoothstep(0.,0.1,life);
    vec3 p=position;
    p.x+=sin(aSeed*12.3+uTime*2.+life*8.)*.08*life+uWindX*life*life*.28;
    p.y+=life*(0.65+h(aSeed)*.35)+uWindY*life*.08;
    vec4 mv=modelViewMatrix*vec4(p,1.);
    gl_PointSize=aSize*(1.-life*.65)*(280./-mv.z);
    gl_Position=projectionMatrix*mv;
  }
`;
const embFragSrc = `
  varying float vAlpha; varying float vLife;
  void main(){
    vec2 uv=gl_PointCoord-.5; if(length(uv)>.5)discard;
    float c=1.-smoothstep(0.,.18,length(uv));
    float g=1.-smoothstep(0.,.5,length(uv));
    vec3 col=mix(vec3(1.,.95,.6),vec3(1.,.28,.01),vLife);
    col=mix(col,vec3(.9,.06,0.),smoothstep(.7,1.,vLife));
    col+=c*.45;
    gl_FragColor=vec4(col,(c*.60+g*.07)*vAlpha);
  }
`;

const smkVertSrc = `
  attribute float aLife; attribute float aSeed; attribute float aSize;
  uniform float uTime; uniform float uWindX;
  varying float vAlpha;
  float h(float n){return fract(sin(n)*43758.5453);}
  void main(){
    float t=uTime*.16+aSeed*6.283,life=mod(t,1.0);
    vAlpha=smoothstep(0.,.2,life)*pow(1.-life,2.4)*.16;
    vec3 p=position;
    p.x+=uWindX*life*.45+sin(aSeed*9.1+uTime*.8+life*3.5)*.15;
    p.y+=life*2.0+h(aSeed+1.)*.3;
    vec4 mv=modelViewMatrix*vec4(p,1.);
    gl_PointSize=aSize*(1.+life*3.2)*(260./-mv.z);
    gl_Position=projectionMatrix*mv;
  }
`;
const smkFragSrc = `
  varying float vAlpha;
  void main(){
    vec2 uv=gl_PointCoord-.5; if(length(uv)>.5)discard;
    float a=(1.-smoothstep(.2,.5,length(uv)))*vAlpha;
    gl_FragColor=vec4(.10,.07,.04,a);
  }
`;

interface HeroProps {
  onOpenOracle: () => void;
}

const Hero: React.FC<HeroProps> = ({ onOpenOracle }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const windRef = useRef({ x: 0, y: 0 });
  const targetRef = useRef({ x: 0, y: 0 });
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const mutedRef = useRef(false);
  const [muted, setMuted] = React.useState(false);

  useEffect(() => {
    const hero = heroRef.current!,
      mount = mountRef.current!;
    const W = () => mount.offsetWidth,
      H = () => mount.offsetHeight;

    const audio = new Audio(bonfireAudio);
    audio.loop = true;
    audio.volume = 0.5;
    audioRef.current = audio;

    let audioStarted = false;
    const startAudio = () => {
      if (audioStarted || mutedRef.current) return;
      audioStarted = true;
      audio.play().catch(() => {});
      document.removeEventListener("click", startAudio);
      document.removeEventListener("touchstart", startAudio);
    };
    document.addEventListener("click", startAudio);
    document.addEventListener("touchstart", startAudio);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W(), H());
    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.88;
    renderer.domElement.style.cssText =
      "position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:4;";
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const getAspect = () => W() / H();
    const camera = new THREE.OrthographicCamera(
      -getAspect(),
      getAspect(),
      1,
      -1,
      0.1,
      100,
    );
    camera.position.z = 5;

  const PX = -0.02,
    PY = -0.34;
  const getFX = () => PX * getAspect(),
    getFY = () => PY;
  let FY = getFY();

    const N = 26,
      VERTS = 4;
    const seeds = new Float32Array(N),
      sizes = new Float32Array(N),
      speeds = new Float32Array(N),
      phases = new Float32Array(N),
      spawnXs = new Float32Array(N);
    for (let i = 0; i < N; i++) {
      seeds[i] = Math.random() * 100;
      sizes[i] = 0.08 + Math.random() * 0.09;
      speeds[i] = 0.6 + Math.random() * 0.6;
      phases[i] = Math.random();
      const angle = (i / N) * Math.PI * 2 + Math.random() * 0.4;
      spawnXs[i] = getFX() + Math.cos(angle) * (0.03 + Math.random() * 0.04);
    }

    const quadGeo = new THREE.PlaneGeometry(1, 1);
    const bPos = quadGeo.attributes.position.array as Float32Array;
    const bUv = quadGeo.attributes.uv.array as Float32Array;
    const bIdx = quadGeo.index!.array as Uint32Array;
    const mPos = new Float32Array(N * VERTS * 3),
      mUv = new Float32Array(N * VERTS * 2),
      mIdx = new Uint32Array(N * 6);
    const mSeed = new Float32Array(N * VERTS),
      mSize = new Float32Array(N * VERTS),
      mSpeed = new Float32Array(N * VERTS),
      mPhase = new Float32Array(N * VERTS),
      mSpX = new Float32Array(N * VERTS);
    for (let i = 0; i < N; i++) {
      const pO = i * VERTS * 3,
        uO = i * VERTS * 2;
      for (let v = 0; v < VERTS; v++) {
        mPos[pO + v * 3] = bPos[v * 3];
        mPos[pO + v * 3 + 1] = bPos[v * 3 + 1];
        mPos[pO + v * 3 + 2] = 0;
        mUv[uO + v * 2] = bUv[v * 2];
        mUv[uO + v * 2 + 1] = bUv[v * 2 + 1];
        mSeed[i * VERTS + v] = seeds[i];
        mSize[i * VERTS + v] = sizes[i];
        mSpeed[i * VERTS + v] = speeds[i];
        mPhase[i * VERTS + v] = phases[i];
        mSpX[i * VERTS + v] = spawnXs[i];
      }
      for (let t = 0; t < 6; t++) mIdx[i * 6 + t] = bIdx[t] + i * VERTS;
    }
    quadGeo.dispose();

    const flameGeo = new THREE.BufferGeometry();
    flameGeo.setAttribute("position", new THREE.BufferAttribute(mPos, 3));
    flameGeo.setAttribute("uv", new THREE.BufferAttribute(mUv, 2));
    flameGeo.setIndex(new THREE.BufferAttribute(mIdx, 1));
    flameGeo.setAttribute("aSeed", new THREE.BufferAttribute(mSeed, 1));
    flameGeo.setAttribute("aSize", new THREE.BufferAttribute(mSize, 1));
    flameGeo.setAttribute("aSpeed", new THREE.BufferAttribute(mSpeed, 1));
    flameGeo.setAttribute("aPhase", new THREE.BufferAttribute(mPhase, 1));
    flameGeo.setAttribute("aSpawnX", new THREE.BufferAttribute(mSpX, 1));

    const flameMat = new THREE.ShaderMaterial({
      vertexShader: vertSrc,
      fragmentShader: fragSrc,
      uniforms: {
        uTime: { value: 0 },
        uWindX: { value: 0 },
        uWindY: { value: 0 },
        uSpawnY: { value: FY },
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
    });
    const flameMesh = new THREE.Mesh(flameGeo, flameMat);
    flameMesh.position.y = getFY();
    scene.add(flameMesh);

    const EC = 180;
    const ep = new Float32Array(EC * 3),
      es = new Float32Array(EC),
      el = new Float32Array(EC),
      ev = new Float32Array(EC),
      ee = new Float32Array(EC);
    for (let i = 0; i < EC; i++) {
      ep[i * 3] = getFX() + (Math.random() - 0.5) * 0.08;
      ep[i * 3 + 1] = getFY();
      ep[i * 3 + 2] = 0;
      es[i] = 2 + Math.random() * 9;
      el[i] = Math.random();
      ev[i] = 0.35 + Math.random() * 0.45;
      ee[i] = Math.random() * Math.PI * 2;
    }
    const embGeo = new THREE.BufferGeometry();
    embGeo.setAttribute("position", new THREE.BufferAttribute(ep, 3));
    embGeo.setAttribute("aSize", new THREE.BufferAttribute(es, 1));
    embGeo.setAttribute("aLife", new THREE.BufferAttribute(el, 1));
    embGeo.setAttribute("aSpeed", new THREE.BufferAttribute(ev, 1));
    embGeo.setAttribute("aSeed", new THREE.BufferAttribute(ee, 1));
    const embMat = new THREE.ShaderMaterial({
      vertexShader: embVertSrc,
      fragmentShader: embFragSrc,
      uniforms: {
        uTime: { value: 0 },
        uWindX: { value: 0 },
        uWindY: { value: 0 },
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    scene.add(new THREE.Points(embGeo, embMat));

    const SC = 40;
    const sp2 = new Float32Array(SC * 3),
      sl = new Float32Array(SC),
      ss = new Float32Array(SC),
      sz = new Float32Array(SC);
    for (let i = 0; i < SC; i++) {
      sp2[i * 3] = getFX() + (Math.random() - 0.5) * 0.06;
      sp2[i * 3 + 1] = getFY() + 0.1;
      sp2[i * 3 + 2] = 0;
      sl[i] = Math.random();
      ss[i] = Math.random() * Math.PI * 2;
      sz[i] = 14 + Math.random() * 24;
    }
    const smkGeo = new THREE.BufferGeometry();
    smkGeo.setAttribute("position", new THREE.BufferAttribute(sp2, 3));
    smkGeo.setAttribute("aLife", new THREE.BufferAttribute(sl, 1));
    smkGeo.setAttribute("aSeed", new THREE.BufferAttribute(ss, 1));
    smkGeo.setAttribute("aSize", new THREE.BufferAttribute(sz, 1));
    const smkMat = new THREE.ShaderMaterial({
      vertexShader: smkVertSrc,
      fragmentShader: smkFragSrc,
      uniforms: {
        uTime: { value: 0 },
        uWindX: { value: 0 },
        uWindY: { value: 0 },
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.NormalBlending,
    });
    scene.add(new THREE.Points(smkGeo, smkMat));

    const onMouse = (e: MouseEvent) => {
      const r = hero.getBoundingClientRect(),
        cx = r.width / 2,
        cy = r.height / 2;
      targetRef.current = {
        x: ((e.clientX - r.left - cx) / cx) * 1.4,
        y: -((e.clientY - r.top - cy) / cy) * 0.5,
      };
    };
    hero.addEventListener("mousemove", onMouse);
  const onResize = () => {
    renderer.setSize(W(), H());
    const a = getAspect();
    camera.left = -a;
    camera.right = a;
    camera.top = 1;
    camera.bottom = -1;
    camera.updateProjectionMatrix();
    FY = getFY();
    flameMesh.position.y = FY;
  };
    window.addEventListener("resize", onResize);

    let raf: number;
    const clock = new THREE.Clock();
    const tick = () => {
      raf = requestAnimationFrame(tick);
      const t = clock.getElapsedTime();
      windRef.current.x += (targetRef.current.x - windRef.current.x) * 0.03;
      windRef.current.y += (targetRef.current.y - windRef.current.y) * 0.03;
      const wx = windRef.current.x,
        wy = windRef.current.y;
      flameMat.uniforms.uTime.value = t;
      flameMat.uniforms.uWindX.value = wx;
      flameMat.uniforms.uWindY.value = wy;
      embMat.uniforms.uTime.value = t;
      embMat.uniforms.uWindX.value = wx;
      embMat.uniforms.uWindY.value = wy;
      smkMat.uniforms.uTime.value = t;
      smkMat.uniforms.uWindX.value = wx;
      smkMat.uniforms.uWindY.value = wy;
      renderer.render(scene, camera);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      audio.pause();
      audio.src = "";
      document.removeEventListener("click", startAudio);
      document.removeEventListener("touchstart", startAudio);
      hero.removeEventListener("mousemove", onMouse);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      if (mount.contains(renderer.domElement))
        mount.removeChild(renderer.domElement);
      [flameGeo, embGeo, smkGeo].forEach((g) => g.dispose());
      [flameMat, embMat, smkMat].forEach((m) => m.dispose());
    };
  }, []);

  const toggleMute = () => {
    mutedRef.current = !mutedRef.current;
    setMuted(mutedRef.current);
    if (audioRef.current) audioRef.current.volume = mutedRef.current ? 0 : 0.5;
  };
  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <div className="hero" ref={heroRef}>
      <div
        className="hero__bg"
        style={{ backgroundImage: `url(${bonfireImg})` }}
      />
      <div className="hero__gradient" />
      <div ref={mountRef} className="hero__three" />
      <div className="hero__content">
        <div className="hero__eyebrow">
          <button
            className="hero__eyebrow-mute"
            onClick={toggleMute}
            aria-label={muted ? "Activar sonido" : "Silenciar"}
          >
            {muted ? "🔇" : "🔊"}
          </button>
          <p className="hero__eyebrow-text">
            Descansa junto las llamas, artesano
          </p>
        </div>
        <h1 className="hero__name">
          <span className="hero__name-line">Andrés</span>
          <span className="hero__name-line hero__name-line--accent">
            Hurtado
          </span>
        </h1>
        <p className="hero__role">Web Developer</p>
        <div className="hero__ornament">
          <span className="hero__ornament-line" />
          <span className="hero__ornament-rune">⚜</span>
          <span className="hero__ornament-line" />
        </div>
        <p className="hero__tagline">
          Forjando experiencias digitales con precisión y fuego.
        </p>
        <div className="hero__actions">
          <button className="btn-primary" onClick={() => scrollTo("proyectos")}>
            Ver Proyectos <span className="hero__btn-arrow">↓</span>
          </button>
          <button className="btn-ghost" onClick={() => scrollTo("contacto")}>
            Contactar
          </button>
          <button className="btn-oracle" onClick={onOpenOracle}>
            <span className="btn-oracle__rune">⚜</span>
            Consultar Oráculo
          </button>
        </div>
      </div>
      <div className="hero__scroll-hint">
        <div className="hero__scroll-line" />
        <span className="hero__scroll-text">Descender</span>
      </div>
      <div className="hero__tags">
        {["React", "TypeScript", "Next.js", "Node.js"].map((t, i) => (
          <span
            key={t}
            className="hero__tag"
            style={{ animationDelay: `${i * 0.15 + 1}s` }}
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  );
};

export default Hero;
