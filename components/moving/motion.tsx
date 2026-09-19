'use client';
import {useEffect,useRef,useState,type ReactNode} from 'react';
import {usePathname} from 'next/navigation';
import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import {Dialog,DialogContent,DialogTitle,DialogDescription} from '@/components/ui/dialog';
import {Progress} from '@/components/ui/progress';
import {Logo} from './shared';
gsap.registerPlugin(ScrollTrigger);
export function MotionProvider({children}:{children:ReactNode}){
 const path=usePathname();
 useEffect(()=>{const mm=gsap.matchMedia();mm.add('(prefers-reduced-motion: no-preference)',()=>{const lenis=new Lenis({duration:.9,smoothWheel:true,syncTouch:false,anchors:true});const tick=(t:number)=>lenis.raf(t*1000);lenis.on('scroll',ScrollTrigger.update);gsap.ticker.add(tick);return()=>{gsap.ticker.remove(tick);lenis.destroy();};});return()=>mm.revert();},[]);
 useEffect(()=>{const mm=gsap.matchMedia();mm.add('(prefers-reduced-motion: no-preference)',()=>{gsap.fromTo('.page-enter',{opacity:.4},{opacity:1,duration:.35,clearProps:'opacity'});gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach(el=>gsap.fromTo(el,{y:35,opacity:.2},{y:0,opacity:1,duration:.8,scrollTrigger:{trigger:el,start:'top 94%',toggleActions:'play none none reverse'}}));gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach(el=>gsap.fromTo(el,{yPercent:-5},{yPercent:5,ease:'none',scrollTrigger:{trigger:el,start:'top bottom',end:'bottom top',scrub:true}}));});return()=>mm.revert();},[path]);
 return <>{children}</>;
}
export function Preloader(){
 const [open,setOpen]=useState(false);const [progress,setProgress]=useState(0);
 const panel=useRef<HTMLDivElement>(null);
 useEffect(()=>{
  if(matchMedia('(prefers-reduced-motion: reduce)').matches||document.fonts.status==='loaded')return;
  let alive=true;let closing=false;
  setOpen(true);
  const finish=()=>{
   if(!alive||closing)return;closing=true;setProgress(100);
   gsap.to(panel.current,{clipPath:'inset(0 0 100% 0 round 0 0 35% 35%)',duration:.65,ease:'power3.inOut',onComplete:()=>{if(alive){setOpen(false);ScrollTrigger.refresh();}}});
  };
  document.fonts.ready.then(finish);
  const timeout=setTimeout(finish,900);
  return()=>{alive=false;clearTimeout(timeout);gsap.killTweensOf(panel.current);};
 },[]);
 return <Dialog open={open} onOpenChange={setOpen}><DialogContent ref={panel} className="intro-dialog intro-loader" showCloseButton={false} onCloseAutoFocus={e=>e.preventDefault()}>
  <DialogTitle className="sr-only">Preparando seu próximo ritmo</DialogTitle><DialogDescription className="sr-only">Carregando a identidade Moving.</DialogDescription>
  <div className="intro-loader-logo"><Logo light/></div><div className="intro-loader-type display" aria-hidden="true">MOVING MOVING MOVING</div>
  <div className="intro-bottom"><span>Preparando seu próximo ritmo</span><span className="mono">{progress}%</span><Progress value={progress} aria-label="Carregamento das fontes"/></div>
 </DialogContent></Dialog>;
}
