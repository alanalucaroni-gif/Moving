'use client';

import {useEffect,useLayoutEffect,useRef,useState} from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {ArrowDown,ArrowLeft,ArrowRight,Pause,Play,RotateCcw} from 'lucide-react';
import {Tabs,TabsList,TabsTrigger,TabsContent} from '@/components/ui/tabs';
import {families,familyProducts,getFamily,type FamilyId,type Product} from '@/data/products';
import {ProductImage,MagneticButton,Arrow,SectionLabel} from './shared';

gsap.registerPlugin(ScrollTrigger);
const motionQuery='(prefers-reduced-motion: no-preference)';
const chapterDirection=[
 {flavor:'Tangerina',lead:'VIVER EM',word:'MOVIMENTO',color:'#F4A633'},
 {flavor:'Limão',lead:'MANTER O',word:'RITMO',color:'#CFDF91'},
 {flavor:'Uva',lead:'IR',word:'ALÉM',color:'#C9B9E0'},
 {flavor:'Laranja',lead:'SEGUIR',word:'LEVE',color:'#F5CF57'},
 {flavor:'Ice tea + Pêssego',lead:'MODO',word:'ENERGIA',color:'#F1999B'},
 {flavor:'Abacaxi e Hortelã',lead:'DAR AQUELE',word:'BOOST',color:'#B1D688'},
];
const chapterProducts=families.map((f,i)=>familyProducts(f.id).find(p=>p.flavor===chapterDirection[i].flavor)||familyProducts(f.id)[0]);

function fruitIndex(flavor:string){
 if(/tangerina|laranja/i.test(flavor))return 0;
 if(/limão|lemonade/i.test(flavor))return 1;
 if(/uva/i.test(flavor))return 2;
 if(/pêssego/i.test(flavor))return 3;
 if(/morango|vermelhas/i.test(flavor))return 4;
 if(/abacaxi/i.test(flavor))return 5;
 return null;
}
function Fruit({flavor,className=''}:{flavor:string;className?:string}){
 const index=fruitIndex(flavor);if(index===null)return null;
 return <span aria-hidden="true" className={`flavor-fruit fruit-cell-${index} ${className}`}/>;
}

export function CinematicOpening(){
 const root=useRef<HTMLElement>(null);const video=useRef<HTMLVideoElement>(null);const veil=useRef<HTMLDivElement>(null);
 const [playing,setPlaying]=useState(false);const [ended,setEnded]=useState(false);const transitioning=useRef(false);
 const go=(manual=false)=>{
  if(transitioning.current)return;
  video.current?.pause();setPlaying(false);setEnded(true);
  if(!manual&&!matchMedia(motionQuery).matches)return;
  const destination=document.getElementById('linhas');if(!destination)return;
  // Never pull a visitor back if they have already started exploring the page.
  if(!manual&&window.scrollY>(root.current?.offsetHeight||0)*.35)return;
  transitioning.current=true;
  const reveal=()=>{
   window.scrollTo({top:destination.getBoundingClientRect().top+window.scrollY,behavior:'instant'});
   if(manual)document.getElementById('chapter-heading-0')?.focus({preventScroll:true});
   gsap.set(veil.current,{scaleY:0});transitioning.current=false;
  };
  if(matchMedia(motionQuery).matches)gsap.fromTo(veil.current,{scaleY:0},{scaleY:1,duration:.7,ease:'power3.inOut',onComplete:reveal});else reveal();
 };
 useEffect(()=>{
  const media=matchMedia(motionQuery);
  const sync=()=>{if(media.matches)video.current?.play().catch(()=>setPlaying(false));else{video.current?.pause();setPlaying(false);}};
  sync();media.addEventListener('change',sync);
  const visible=()=>{if(document.hidden){video.current?.pause();setPlaying(false);}};
  document.addEventListener('visibilitychange',visible);
  return()=>{media.removeEventListener('change',sync);document.removeEventListener('visibilitychange',visible);gsap.killTweensOf(veil.current);};
 },[]);
 function toggle(){if(!video.current)return;if(video.current.paused){if(ended){video.current.currentTime=0;setEnded(false);}video.current.play().catch(()=>setPlaying(false));}else video.current.pause();}
 return <section ref={root} className="cinematic-opening" aria-label="Moving em movimento">
  <h1 className="sr-only">Qual é o seu ritmo de hoje? Moving — proteína, hidratação e sabor.</h1>
  <video ref={video} className="opening-film" muted playsInline preload="metadata" poster="/assets/moving/hero/intro-poster.webp" aria-label="Filme Moving Energy Pro pêssego" onPlay={()=>setPlaying(true)} onPause={()=>setPlaying(false)} onEnded={()=>go()} onError={()=>{setEnded(true);setPlaying(false);}}>
   <source src="/assets/moving/hero/moving-intro.webm" type="video/webm"/>
   <source src="/assets/moving/hero/moving-intro.mp4" type="video/mp4"/>
  </video>
  <div className="opening-caption"><p>Proteína, hidratação e sabor.<br/>Seu próximo ritmo começa aqui.</p><button onClick={()=>go(true)}>Entrar no movimento <Arrow/></button></div>
  <div className="opening-controls"><button onClick={toggle} aria-label={playing?'Pausar filme':ended?'Rever filme':'Reproduzir filme'}>{playing?<Pause size={16}/>:ended?<RotateCcw size={16}/>:<Play size={16}/>}<span>{playing?'Pausar':ended?'Rever filme':'Reproduzir'}</span></button><button onClick={()=>go(true)}><ArrowDown size={16}/><span>Explorar</span></button></div>
  <div ref={veil} className="opening-liquid" aria-hidden="true"/>
 </section>;
}

export function RhythmChapters(){
 const root=useRef<HTMLElement>(null);const timeline=useRef<gsap.core.Timeline|null>(null);
 const [active,setActive]=useState(0);const [enhanced,setEnhanced]=useState(false);
 useLayoutEffect(()=>{
  const mm=gsap.matchMedia();
  mm.add({motion:motionQuery,small:'(max-width: 700px)',tall:'(min-height: 620px)'},context=>{
   if(!context.conditions?.motion||!context.conditions.tall)return;
   const el=root.current!;const mobile=!!context.conditions.small;
   el.classList.add('chapters-ready');setEnhanced(true);
   const scenes=Array.from(el.querySelectorAll<HTMLElement>('.rhythm-chapter'));
   gsap.set(scenes.slice(1),{clipPath:'inset(100% 0 0 0 round 12% 12% 0 0)'});
   const tl=gsap.timeline({onUpdate(){setActive(Math.max(0,Math.min(5,Math.floor((this.time()+.22)/1.5))));},scrollTrigger:{trigger:el,start:'top top',end:'bottom bottom',scrub:.55,invalidateOnRefresh:true}});
   timeline.current=tl;
   scenes.forEach((scene,i)=>{
    const at=i*1.5;const direction=i%2===0?1:-1;
    if(i){
     tl.to(scene,{clipPath:'inset(0% 0 0 0 round 0% 0% 0 0)',duration:.65,ease:'power2.inOut'},at-.52)
      .fromTo(scene.querySelector('.chapter-art'),{x:(mobile?160:360)*direction,y:90,rotation:18*direction,scale:.75},{x:0,y:0,rotation:0,scale:1,duration:.85,ease:'power3.out'},at-.35)
      .fromTo(scene.querySelectorAll('.chapter-heading > span'),{yPercent:110,opacity:0},{yPercent:0,opacity:1,duration:.65,stagger:.09,ease:'power3.out'},at-.15)
      .fromTo(scene.querySelector('.chapter-copy'),{y:30,opacity:0},{y:0,opacity:1,duration:.45},at+.15);
    }
    tl.fromTo(scene.querySelector('.chapter-packshot'),{rotation:direction*-9,yPercent:3},{rotation:direction*3,yPercent:-4,duration:1.25,ease:'none'},Math.max(0,at+.3))
     .fromTo(scene.querySelectorAll('.flavor-fruit'),{yPercent:30,rotation:-15},{yPercent:-40,rotation:20,duration:1.35,stagger:.04,ease:'none'},Math.max(0,at));
    if(i<5)tl.to(scene.querySelector('.chapter-art'),{x:-direction*(mobile?100:210),y:-70,rotation:-direction*12,scale:.85,duration:.6,ease:'power2.in'},at+1.02)
     .to(scene.querySelector('.chapter-heading'),{y:-35,opacity:0,duration:.45},at+1.12);
   });
   let alive=true;document.fonts.ready.then(()=>{if(alive)ScrollTrigger.refresh();});
   return()=>{alive=false;timeline.current=null;el.classList.remove('chapters-ready');setEnhanced(false);};
  },root);
  return()=>mm.revert();
 },[]);
 function jump(i:number){
  const trigger=timeline.current?.scrollTrigger;
  if(trigger&&timeline.current){const ratio=(i*1.5+.34)/timeline.current.duration();window.scrollTo({top:trigger.start+(trigger.end-trigger.start)*ratio,behavior:'smooth'});}
  else document.getElementById('chapter-heading-'+i)?.scrollIntoView({behavior:matchMedia(motionQuery).matches?'smooth':'instant',block:'center'});
 }
 return <section id="linhas" ref={root} className="rhythm-chapters" aria-label="Os seis ritmos da Moving"><div className="chapters-stage">
  {families.map((family,i)=>{const direction=chapterDirection[i];const product=chapterProducts[i];return <article key={family.id} className={`rhythm-chapter chapter-${i%2?'left':'right'}`} style={{background:direction.color}} aria-hidden={enhanced&&active!==i} inert={enhanced&&active!==i}>
   <h2 id={'chapter-heading-'+i} tabIndex={-1} className="chapter-heading display"><span>{direction.lead}</span><span>{direction.word}</span></h2>
   <div className="chapter-art"><Fruit flavor={product.flavor} className="fruit-one"/><ProductImage product={product} className="chapter-packshot" priority={i===0}/><Fruit flavor={product.flavor} className="fruit-two"/><Fruit flavor={product.flavor} className="fruit-three"/></div>
   <div className="chapter-copy"><h3>{family.name}</h3><p>{family.description}</p><div className="chapter-facts">{family.attributes.slice(0,3).map(a=><span key={a}>{a}</span>)}</div><Link className="chapter-link" href={'/produtos/'+product.slug}>Conheça a linha <Arrow/></Link></div>
   <span className="chapter-volume">{family.amount} <Arrow/></span>
  </article>;})}
  <nav className="chapter-pagination" aria-label="Navegar entre os ritmos">{families.map((f,i)=><button key={f.id} onClick={()=>jump(i)} aria-label={f.rhythm} aria-current={active===i?'step':undefined}><span/></button>)}</nav>
  <a href="#ritmos" className="chapter-next"><ArrowDown size={14}/> Encontre a sua</a>
 </div></section>;
}

export function FlowManifesto(){
 const root=useRef<HTMLElement>(null);
 useLayoutEffect(()=>{const mm=gsap.matchMedia();mm.add(motionQuery,()=>{
  const q=gsap.utils.selector(root);
  const tl=gsap.timeline({scrollTrigger:{trigger:root.current,start:'top bottom',end:'bottom top',scrub:.6}});
  tl.fromTo(q('.flow-manifesto-title'),{y:80},{y:-55,ease:'none'},0)
   .fromTo(q('.manifesto-print-0'),{y:160,rotation:-17},{y:-50,rotation:-9,ease:'none'},0)
   .fromTo(q('.manifesto-print-1'),{y:80,rotation:12},{y:-100,rotation:5,ease:'none'},0)
   .fromTo(q('.manifesto-print-2'),{y:200,rotation:17},{y:-25,rotation:12,ease:'none'},0);
 },root);return()=>mm.revert();},[]);
 return <section ref={root} className="flow-manifesto" id="movimento"><div className="flow-manifesto-copy"><SectionLabel>GOOD TIMES. ALWAYS FLOWING.</SectionLabel><h2 className="flow-manifesto-title display">DO SEU<br/>JEITO.<br/><span>NO SEU<br/>TEMPO.</span></h2><p>6 linhas. A sua Moving.<br/>No ritmo da vida real.</p><Link href="/a-moving" className="chapter-link">Conheça a Moving <Arrow/></Link></div><div className="manifesto-prints">
  {[['FEED-copiarsache.webp','Moving Hydro PRO em pó sabor tangerina'],['FEED-copiar23411s.webp','Pessoa com garrafas coloridas Moving Hydro Protein'],['FEED-copiar22.webp','Comunidade Moving reunida em um evento']].map(([src,alt],i)=><figure key={src} className={'manifesto-print-'+i}><img src={'/assets/moving/social/'+src} alt={alt} width="819" height="1024" loading="lazy"/></figure>)}
 </div></section>;
}

export function RhythmStudio(){
 const [selection,setSelection]=useState({family:families[0].id,index:3,previous:null as Product|null});
 const root=useRef<HTMLElement>(null);const start=useRef(0);
 const list=familyProducts(selection.family);const p=list[selection.index]||list[0];const family=getFamily(selection.family);
 function choose(familyId:FamilyId,index:number){setSelection(old=>{const list=familyProducts(familyId);const next=(index+list.length)%list.length;if(old.family===familyId&&old.index===next)return old;return {family:familyId,index:next,previous:familyProducts(old.family)[old.index]};});}
 function move(step:number){choose(selection.family,selection.index+step);}
 useLayoutEffect(()=>{const mm=gsap.matchMedia();mm.add(motionQuery,()=>{
  const q=gsap.utils.selector(root);const tl=gsap.timeline();
  tl.fromTo(q('.studio-outgoing'),{x:0,y:0,rotation:-7,opacity:1},{x:-240,y:-40,rotation:-35,opacity:0,duration:.55,ease:'power2.in'},0)
   .fromTo(q('.studio-current'),{x:230,y:35,rotation:28,scale:.82,opacity:0},{x:0,y:0,rotation:-7,scale:1,opacity:1,duration:.85,ease:'power3.out'},.12)
   .fromTo(q('.studio-orbit'),{scale:.65,opacity:.2},{scale:1,opacity:1,duration:.8,ease:'power3.out'},0)
   .fromTo(q('.studio-flavor-word'),{x:120,opacity:0},{x:0,opacity:.23,duration:.9,ease:'power3.out'},.08)
   .fromTo(q('.studio-fruit'),{y:65,scale:.7,rotation:-25,opacity:0},{y:0,scale:1,rotation:0,opacity:1,duration:.85,stagger:.08,ease:'power3.out'},.15)
   .fromTo(q('.studio-copy-main'),{y:25,opacity:0},{y:0,opacity:1,duration:.5},.15);
 },root);return()=>mm.revert();},[p.slug]);
 return <section id="ritmos" ref={root} className="rhythm-studio"><span id="sabores" className="studio-anchor"/>
  <div className="studio-heading"><h2 className="display">MOVE VOCÊ.</h2><p>O que o seu dia pede agora?<br/>Escolha sua linha. Encontre seu sabor.</p></div>
  <Tabs value={selection.family} onValueChange={v=>choose(v as FamilyId,0)}><TabsList className="studio-family-tabs" aria-label="Linhas Moving">{families.map(f=><TabsTrigger key={f.id} value={f.id}>{f.short}</TabsTrigger>)}</TabsList><TabsContent value={selection.family}>
  <div className="studio-content"><div className="studio-art" onTouchStart={e=>{start.current=e.touches[0].clientX;}} onTouchEnd={e=>{const d=e.changedTouches[0].clientX-start.current;if(Math.abs(d)>45)move(d>0?-1:1);}}>
   <div className="studio-orbit" style={{background:p.color}} aria-hidden="true"/><div className="studio-flavor-word display" aria-hidden="true">{p.flavor.replace('Ice tea + ','')}</div>
   <Fruit flavor={p.flavor} className="studio-fruit studio-fruit-one"/>
   {selection.previous&&<div className="studio-previous-wrap" aria-hidden="true"><ProductImage product={selection.previous} className="studio-outgoing"/></div>}
   <ProductImage key={p.slug} product={p} className="studio-current"/>
   <Fruit flavor={p.flavor} className="studio-fruit studio-fruit-two"/>
   <button className="studio-prev icon-button" aria-label="Sabor anterior" onClick={()=>move(-1)}><ArrowLeft size={18}/></button><button className="studio-next icon-button" aria-label="Próximo sabor" onClick={()=>move(1)}><ArrowRight size={18}/></button>
   <span className="studio-amount">{p.amount}</span>
  </div><div className="studio-copy"><div className="studio-copy-main" aria-live="polite"><p className="studio-rhythm">{family.rhythm}</p><h3 className="display">{family.name}</h3><p>{family.description}</p><ul>{family.attributes.map(a=><li key={a}>{a}</li>)}</ul></div>
   <fieldset className="studio-flavors"><legend>Sabor: <strong>{p.flavor}</strong></legend><div>{list.map((item,i)=><button key={item.slug} onClick={()=>choose(selection.family,i)} aria-label={item.flavor} aria-pressed={p.slug===item.slug}><span style={{background:item.color}}/><small>{item.flavor.replace('Ice tea + ','')}</small></button>)}</div></fieldset>
   <div className="studio-actions"><MagneticButton href={'/produtos/'+p.slug}>Ver minha Moving</MagneticButton><Link href={p.buyUrl||'/onde-comprar?produto='+p.slug} target={p.buyUrl?'_blank':undefined} rel={p.buyUrl?'noopener noreferrer':undefined} className="chapter-link">Comprar <Arrow/></Link></div>
  </div></div></TabsContent></Tabs>
 </section>;
}
