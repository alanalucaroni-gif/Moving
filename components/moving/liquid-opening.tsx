'use client';

import {useEffect,useRef,useState} from 'react';
import {RotateCcw} from 'lucide-react';

const crops=[
 [672,1103,163,425],[187,1096,171,433],
 [647,729,211,356],[114,754,319,314],
 [591,402,321,316],[113,404,320,316],
 [591,62,319,318],[113,62,319,318],
].map(([x,y,w,h])=>[x/1024,y/1536,w/1024,h/1536]);

const clamp=(value:number,min:number,max:number)=>Math.max(min,Math.min(max,value));
const random=(seed:number)=>{const value=Math.sin(seed*127.1+311.7)*43758.5453;return value-Math.floor(value);};

export function LiquidOpening(){
 const sectionRef=useRef<HTMLElement>(null);
 const sceneRef=useRef<HTMLDivElement>(null);
 const canvasRef=useRef<HTMLCanvasElement>(null);
 const tabRef=useRef<HTMLButtonElement>(null);
 const calloutRef=useRef<HTMLButtonElement>(null);
 const arrowRef=useRef<SVGSVGElement>(null);
 const arrowPathRef=useRef<SVGPathElement>(null);
 const [phase,setPhase]=useState<'loading'|'rotating'|'ready'|'opening'|'pouring'|'error'>('loading');
 const [status,setStatus]=useState('Carregando a lata…');
 const controls=useRef<{open:()=>void;reset:()=>void}>({open(){},reset(){}});

 useEffect(()=>{
  const section=sectionRef.current,scene=sceneRef.current,canvas=canvasRef.current,tab=tabRef.current,callout=calloutRef.current,arrow=arrowRef.current,arrowPath=arrowPathRef.current;
  if(!section||!scene||!canvas||!tab||!callout||!arrow||!arrowPath)return;
  const context=canvas.getContext('2d');
  const mask=document.createElement('canvas'),mc=mask.getContext('2d',{willReadFrequently:true});
  if(!context||!mc){setPhase('error');setStatus('Seu navegador não conseguiu iniciar a animação.');return;}
  const ctx=context,experience=section;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  let image:HTMLImageElement|null=null,w=1,h=1,localPhase:typeof phase='loading',frame=0,start:number|null=null,pour:number|null=null,last:number|null=null,raf:number|null=null;
  let points:{x:number;y:number;bx:number;by:number}[]=[],progress=0,target=0,mx=0,my=0,tail=0,spring=0,velocity=0,previousY=scrollY;
  const pointer={x:0,y:0,active:false};
  const updatePhase=(next:typeof phase,text:string)=>{localPhase=next;setPhase(next);setStatus(text);};
  const stop=()=>{if(raf!==null)cancelAnimationFrame(raf);raf=null;last=null;};
  const wake=()=>{if(raf===null&&!document.hidden&&localPhase!=='error')raf=requestAnimationFrame(render);};
  const scrollProgress=()=>{const rect=experience.getBoundingClientRect();target=clamp(-rect.top/Math.max(1,experience.offsetHeight-scene.clientHeight),0,1);};
  const buildText=()=>{
   mask.width=Math.ceil(w);mask.height=Math.ceil(h);mc.clearRect(0,0,w,h);mc.font='900 100px Arial';
   const size=Math.min(w*.91/mc.measureText('MOVING').width*100,h*.36);mc.font=`900 ${size}px Arial`;mc.textAlign='center';mc.textBaseline='alphabetic';mc.fillStyle='white';
   const metrics=mc.measureText('MOVING'),ascent=metrics.actualBoundingBoxAscent||size*.75,descent=metrics.actualBoundingBoxDescent||0;
   mc.fillText('MOVING',w/2,h*.55+(ascent-descent)/2);
   const data=mc.getImageData(0,0,mask.width,mask.height).data,step=Math.max(2,Math.round(w/380));points=[];
   for(let y=0;y<mask.height;y+=step)for(let x=0;x<mask.width;x+=step)if(data[(y*mask.width+x)*4+3]>140)points.push({x,y,bx:x,by:y});
  };
  const resize=()=>{w=Math.max(1,scene.clientWidth);h=Math.max(1,scene.clientHeight);const density=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(w*density);canvas.height=Math.round(h*density);ctx.setTransform(density,0,0,density,0,0);ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';arrow.setAttribute('viewBox',`0 0 ${w} ${h}`);tail=w/2;buildText();scrollProgress();wake();};
  const begin=()=>{stop();frame=reduced.matches?3:0;start=pour=null;spring=velocity=mx=my=0;tail=w/2;pointer.active=false;updatePhase(reduced.matches?'ready':'rotating',reduced.matches?'Clique no lacre para abrir.':'Preparando seu movimento…');wake();};
  const drawText=(dt:number)=>{const opacity=clamp(1-progress*2.2,0,1);if(!opacity)return;const radius=Math.min(125,w*.22),follow=reduced.matches?1:1-Math.exp(-11*dt),dot=Math.max(.85,Math.max(2,Math.round(w/380))*.36);ctx.save();ctx.globalAlpha=opacity;ctx.fillStyle='#61bb0a';ctx.beginPath();for(const p of points){let tx=p.bx,ty=p.by;if(pointer.active&&!reduced.matches){const dx=tx-pointer.x,dy=ty-pointer.y,distance=Math.hypot(dx,dy);if(distance<radius){const angle=distance>.01?Math.atan2(dy,dx):p.bx*.1,force=50*(1-distance/radius)**2;tx+=Math.cos(angle)*force;ty+=Math.sin(angle)*force;}}p.x+=(tx-p.x)*follow;p.y+=(ty-p.y)*follow;ctx.moveTo(p.x+dot,p.y);ctx.arc(p.x,p.y,dot,0,Math.PI*2);}ctx.fill();ctx.restore();};
  const project=(x:number,y:number,cx:number,cy:number,angle:number)=>({x:cx+x*Math.cos(angle)-y*Math.sin(angle),y:cy+x*Math.sin(angle)+y*Math.cos(angle)});
  const drawCan=(cx:number,cy:number,size:number,angle:number)=>{
   if(!image)return {x:cx,y:cy};frame=clamp(Math.floor(frame),0,7);const crop=crops[frame],sw=crop[2]*image.naturalWidth,sh=crop[3]*image.naturalHeight,scale=frame<3?Math.min(size/sw,size*1.35/sh):size/Math.max(sw,sh),dw=sw*scale,dh=sh*scale;
   ctx.save();ctx.translate(cx,cy);ctx.rotate(angle+Math.PI);ctx.drawImage(image,crop[0]*image.naturalWidth,crop[1]*image.naturalHeight,sw,sh,-dw/2,-dh/2,dw,dh);ctx.restore();
   const hit=project(0,-size*.1,cx,cy,angle);tab.style.left=hit.x+'px';tab.style.top=hit.y+'px';tab.style.width=size*.28+'px';tab.style.height=size*.38+'px';tab.style.transform=`translate(-50%,-50%) rotate(${angle}rad)`;
   const labelWidth=callout.offsetWidth||200,lx=w<600?clamp(cx+size*.1,20,w-labelWidth-20):clamp(cx+size*.45,20,w-labelWidth-20),ly=cy-size*(w<600?.88:.66),ax=lx+Math.min(35,labelWidth*.2),ay=ly+44;
   callout.style.left=lx+'px';callout.style.top=ly+'px';arrowPath.setAttribute('d',`M ${ax} ${ay} Q ${ax-45} ${(ay+hit.y)/2+30} ${hit.x+7} ${hit.y+12}`);
   return project(0,size*.13,cx,cy,angle);
  };
  const advance=(now:number)=>{if(!['rotating','opening'].includes(localPhase))return;if(start===null)start=now;const elapsed=Math.max(0,now-start);if(localPhase==='rotating'){frame=clamp(Math.floor(elapsed/650),0,3);if(elapsed>=2600){start=null;frame=3;updatePhase('ready','Clique no lacre para abrir.');}return;}frame=clamp(4+Math.floor(elapsed/400),4,7);if(frame>=6&&pour===null)pour=now;if(elapsed>=1600){start=null;frame=7;updatePhase('pouring','Role para baixo. O movimento continua.');}};
  const drawLiquid=(now:number,origin:{x:number;y:number},size:number)=>{if(pour===null)return;const time=reduced.matches?0:now/1000,reveal=reduced.matches?1:clamp((now-pour)/800,0,1);if(!reveal)return;const full=Math.max(1,h-origin.y+80),length=full*reveal,neck=size*.145,center=(y:number)=>origin.x+(tail-origin.x)*y/full+Math.sin(y*.015-time*2)*12*Math.min(1,y/160),width=(y:number)=>neck+(y/full)**1.2*w*(.16+progress*.25)+Math.abs(spring)*y/full*.35,wave=(y:number,shift:number)=>Math.min(1,y/100)*(Math.sin(y*.027-time*3.4+shift)*5+Math.sin(y*.057-time*4.2+shift)*(2+Math.abs(spring)*.02)),path=new Path2D(),count=Math.max(1,Math.ceil(length/5));path.moveTo(origin.x-neck,origin.y);for(let i=0;i<=count;i++){const y=length*i/count;path.lineTo(center(y)-width(y)+wave(y,0),origin.y+y);}for(let i=count;i>=0;i--){const y=length*i/count;path.lineTo(center(y)+width(y)+wave(y,2),origin.y+y);}path.bezierCurveTo(origin.x+neck*.75,origin.y-neck*.4,origin.x-neck*.75,origin.y-neck*.4,origin.x-neck,origin.y);path.closePath();if(reveal>=.99){const top=h+75-progress*(h+175)-Math.abs(spring)*.35;path.moveTo(-30,top);path.lineTo(-30,h+100);path.lineTo(w+30,h+100);const waves=Math.ceil((w+60)/6);for(let i=0;i<=waves;i++){const x=w+30-(w+60)*i/waves;path.lineTo(x,top+Math.sin(x*.009+time*1.4)*11+Math.sin(x*.018-time*1.7)*(4+Math.abs(spring)*.18));}path.closePath();}ctx.save();ctx.fillStyle='#80cf26';ctx.fill(path);ctx.clip(path);for(let i=0;i<(w<600?30:50);i++){const x=random(i+10)*w,y=(random(i+50)*(h+80)+time*(75+random(i+30)*95))%(h+80)-40,r=.7+random(i+70)**2*2.6,g=ctx.createRadialGradient(x-r*.3,y-r*.35,.1,x,y,r);g.addColorStop(0,'rgba(248,255,235,.72)');g.addColorStop(.55,'rgba(209,242,158,.14)');g.addColorStop(1,'rgba(113,173,50,.06)');ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fillStyle=g;ctx.fill();}ctx.restore();};
  function render(now:number){raf=null;try{const dt=last===null?.016:clamp((now-last)/1000,.001,.033);last=now;const tx=pointer.active?clamp((pointer.x/w-.5)*2,-1,1):0,ty=pointer.active?clamp((pointer.y/h-.5)*2,-1,1):0;if(reduced.matches){progress=target;mx=my=spring=velocity=0;}else{progress+=(target-progress)*(1-Math.exp(-12*dt));mx+=(tx-mx)*(1-Math.exp(-8*dt));my+=(ty-my)*(1-Math.exp(-8*dt));velocity+=(-110*spring-16*velocity)*dt;spring+=velocity*dt;}ctx.clearRect(0,0,w,h);drawText(dt);if(image){advance(now);const motion=reduced.matches?0:1,size=Math.min(390,w*(w<600?.55:.28),h*.45)*(1+progress*.22),cx=w/2+mx*20*motion,cy=h*.54-progress*h*.78+my*12*motion+Math.sin(now/1100)*2*motion+spring,angle=mx*.06*motion,origin=drawCan(cx,cy,size,angle);tail+=(origin.x-tail)*(reduced.matches?1:1-Math.exp(-3.5*dt));drawLiquid(now,origin,size);}const rect=experience.getBoundingClientRect(),visible=rect.bottom>0&&rect.top<h;if((visible&&!reduced.matches)||['rotating','opening'].includes(localPhase)||Math.abs(progress-target)>.0005)wake();else last=null;}catch(error){stop();updatePhase('error',error instanceof Error?'Erro na animação: '+error.message:'Erro na animação.');}}
  const point=(event:PointerEvent)=>{const rect=scene.getBoundingClientRect();pointer.x=event.clientX-rect.left;pointer.y=event.clientY-rect.top;pointer.active=true;wake();};
  const release=()=>{pointer.active=false;wake();};
  const onMove=(event:PointerEvent)=>{if(event.pointerType==='mouse'||event.buttons>0)point(event);};
  const onDown=(event:PointerEvent)=>{if(!(event.target as HTMLElement).closest('button,a,input,label'))point(event);};
  const onScroll=()=>{const delta=scrollY-previousY;previousY=scrollY;pointer.active=false;scrollProgress();const rect=experience.getBoundingClientRect();if(delta<0&&pour!==null&&rect.bottom>0&&rect.top<h&&!reduced.matches)velocity=clamp(velocity-Math.min(-delta,80)*2,-260,260);wake();};
  const open=()=>{if(localPhase!=='ready')return;start=null;if(reduced.matches){frame=7;pour=performance.now();updatePhase('pouring','Role para explorar.');}else updatePhase('opening','Abrindo seu movimento…');wake();};
  const reset=()=>{if(!image)return;scrollTo({top:scrollY+experience.getBoundingClientRect().top,behavior:'smooth'});previousY=scrollY;scrollProgress();progress=target;begin();};
  controls.current={open,reset};
  scene.addEventListener('pointermove',onMove,{passive:true});scene.addEventListener('pointerdown',onDown,{passive:true});scene.addEventListener('pointerleave',release);scene.addEventListener('pointercancel',release);scene.addEventListener('pointerup',release);addEventListener('scroll',onScroll,{passive:true});addEventListener('resize',resize);
  const visibility=()=>{if(document.hidden){stop();pointer.active=false;}else wake();};document.addEventListener('visibilitychange',visibility);
  const preference=()=>{if(reduced.matches&&localPhase==='rotating'){frame=3;start=null;updatePhase('ready','Clique no lacre para abrir.');}else if(reduced.matches&&localPhase==='opening'){frame=7;start=null;pour=performance.now();updatePhase('pouring','Role para explorar.');}scrollProgress();wake();};reduced.addEventListener('change',preference);
  resize();const next=new Image();next.onload=()=>{image=next;begin();};next.onerror=()=>updatePhase('error','Não foi possível carregar a sequência da lata.');next.src='/assets/moving/opening/can-sequence.png';
  return()=>{stop();scene.removeEventListener('pointermove',onMove);scene.removeEventListener('pointerdown',onDown);scene.removeEventListener('pointerleave',release);scene.removeEventListener('pointercancel',release);scene.removeEventListener('pointerup',release);removeEventListener('scroll',onScroll);removeEventListener('resize',resize);document.removeEventListener('visibilitychange',visibility);reduced.removeEventListener('change',preference);};
 },[]);

 const ready=phase==='ready';
 return <>
  <section ref={sectionRef} className="liquid-experience" aria-label="Abra seu movimento">
   <div ref={sceneRef} className="liquid-scene">
    <h1 className="sr-only">Moving. Proteína em movimento.</h1><p className="liquid-tagline">PROTEÍNA EM MOVIMENTO</p>
    <canvas ref={canvasRef} className="liquid-canvas" aria-hidden="true"/>
    <svg ref={arrowRef} className="liquid-arrow" aria-hidden="true" style={{display:ready?'block':'none'}}><defs><marker id="liquid-tip" viewBox="0 0 16 16" refX="13" refY="8" markerWidth="6" markerHeight="6" orient="auto"><path d="M2 2 L13 8 L2 14" fill="none" stroke="#61bb0a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></marker></defs><path ref={arrowPathRef} fill="none" stroke="#61bb0a" strokeWidth="4" strokeLinecap="round" markerEnd="url(#liquid-tip)"/></svg>
    <button ref={calloutRef} className="liquid-callout display" hidden={!ready} onClick={()=>controls.current.open()}>ABRA AQUI</button><button ref={tabRef} className="liquid-tab" aria-label="Abrir o lacre da lata" hidden={!ready} onClick={()=>controls.current.open()}/>
    <div className="liquid-controls"><p role="status" aria-live="polite">{status}</p><button disabled={phase==='loading'} onClick={()=>controls.current.reset()}><RotateCcw size={15}/> Reiniciar</button><a href="#linhas">Explore Moving ↓</a></div>
   </div>
  </section>
  <section className="liquid-next" aria-labelledby="liquid-next-title"><small>MOVING ENERGY PRO</small><h2 id="liquid-next-title" className="display">SEU RITMO.<br/>SEU MOVIMENTO.</h2><div><span>Ice Tea Limão</span><span>Zero açúcares</span><span>300 ml</span></div><p>Moving Energy Pro<br/>Ice Tea Limão</p></section>
 </>;
}
