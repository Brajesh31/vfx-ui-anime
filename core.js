/* VFX UI Anime: shared motion engine and canvas effects. Original implementation. */
(() => {
  if (window.VFXAnime) return;
  const TAU=Math.PI*2, clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
  const reduced=matchMedia("(prefers-reduced-motion: reduce)");
  let calm=reduced.matches; reduced.addEventListener?.("change",e=>calm=e.matches);
  const canvas=document.createElement("canvas"); canvas.className="vfx-fx"; canvas.setAttribute("aria-hidden","true");
  const ctx=canvas.getContext("2d"); let particles=[],raf=0,last=0,dpr=1;
  function resize(){dpr=Math.min(devicePixelRatio||1,2);canvas.width=innerWidth*dpr;canvas.height=innerHeight*dpr;canvas.style.width=innerWidth+"px";canvas.style.height=innerHeight+"px";}
  function mount(){if(!canvas.isConnected&&document.body)document.body.append(canvas);resize();}
  addEventListener("resize",resize,{passive:true});
  function emit(type,x,y,opts={}){if(calm)return;mount();const count=opts.count??(type==="burst"?13:7),power=opts.power??1;
    for(let i=0;i<count;i++){const a=(i/count)*TAU+(Math.random()-.5)*.4, speed=(type==="burst"?150:85)*power*(.45+Math.random()*.8);particles.push({x,y,vx:Math.cos(a)*speed,vy:Math.sin(a)*speed-25,age:0,life:.38+Math.random()*.42,r:2+Math.random()*5,type});}
    if(!raf){last=performance.now();raf=requestAnimationFrame(frame);}
  }
  function frame(now){const dt=Math.min(.034,(now-last)/1000);last=now;ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,innerWidth,innerHeight);
    particles=particles.filter(p=>p.age<p.life);for(const p of particles){p.age+=dt;p.vy+=260*dt;p.x+=p.vx*dt;p.y+=p.vy*dt;const t=1-p.age/p.life;ctx.globalAlpha=t;ctx.fillStyle=p.type==="burst"?"#ff5f9e":p.type==="spark"?"#6557d9":"#aaa5ff";ctx.beginPath();if(p.type==="burst"){ctx.moveTo(p.x,p.y-p.r*2);ctx.lineTo(p.x+p.r*.7,p.y);ctx.lineTo(p.x,p.y+p.r*2);ctx.lineTo(p.x-p.r*.7,p.y);ctx.closePath();}else ctx.arc(p.x,p.y,p.r*t,0,TAU);ctx.fill();}
    ctx.globalAlpha=1;if(particles.length)raf=requestAnimationFrame(frame);else{ctx.clearRect(0,0,innerWidth,innerHeight);raf=0;}
  }
  function impact(el,type="burst",power=1){const r=el.getBoundingClientRect();emit(type,r.left+r.width/2,r.top+r.height/2,{power});}
  const spring=(from,to,t)=>to+(from-to)*Math.exp(-8*t)*Math.cos(13*t);
  window.VFXAnime={emit,impact,spring,get reducedMotion(){return calm;},version:"1.0.0"};
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",mount,{once:true});else mount();
})();