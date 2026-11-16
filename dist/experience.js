(() => {
  const scrollScene=document.querySelector('.portal-scroll');
  const stage=document.querySelector('.portal-stage');
  const panels=[...document.querySelectorAll('[data-chapter]')];
  const buttons=[...document.querySelectorAll('[data-phase]')];
  const canvas=stage.querySelector('canvas');const ctx=canvas.getContext('2d');
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const off=()=>document.documentElement.classList.contains('motion-paused')||reduced.matches;
  let target=0,current=0,phase=-1,visible=true,raf=0,time=0,lastTime=0,mx=0,my=0;
  let width=1,height=1;
  const stars=Array.from({length:125},(_,i)=>({x:Math.sin(i*12.9898)*2,y:Math.cos(i*7.233)*1.6,z:(i%31)/31+.15,size:i%4===0?1.8:.8}));
  function resize(){width=stage.clientWidth;height=stage.clientHeight;const dpr=Math.min(devicePixelRatio||1,1.5);canvas.width=width*dpr;canvas.height=height*dpr;ctx?.setTransform(dpr,0,0,dpr,0,0);paint();}
  function setPhase(next){
    if(next===phase)return;phase=next;
    panels.forEach((panel,i)=>{const active=i===next;panel.style.opacity=active?'1':'0';panel.style.translate=active?'0 0':'0 25px';panel.style.pointerEvents=active?'auto':'none';panel.setAttribute('aria-hidden',String(!active));panel.inert=!active;});
    buttons.forEach((b,i)=>b.setAttribute('aria-pressed',String(i===next)));
  }
  function apply(){
    const digital=Math.max(0,Math.min(1,current<.52?(current-.12)/.28:(.9-current)/.23));
    const mobile=width<=760;
    stage.style.setProperty('--scene',current.toFixed(4));stage.style.setProperty('--digital',digital.toFixed(4));
    stage.style.setProperty('--scan',digital>.02&&digital<.98?'1':'0');
    stage.style.setProperty('--travel',`${Math.sin(current*Math.PI*2)*(mobile?18:65)}px`);
    stage.style.setProperty('--lift',`${Math.sin(current*Math.PI)*(mobile?-8:-20)}px`);
    stage.style.setProperty('--turn',`${Math.sin(current*Math.PI*2)*-5}deg`);
    stage.style.setProperty('--zoom',`${1+Math.sin(current*Math.PI)*(mobile?.04:.06)}`);
    setPhase(Math.min(2,Math.floor(current*3)));
  }
  function paint(){
    if(!ctx)return;ctx.clearRect(0,0,width,height);
    const cx=width*(width<=760?.5:.72),cy=height*.52;
    for(const star of stars){
      const z=((star.z+current*1.4+time*.018)%1.3)+.15;
      const x=cx+star.x*width*.24/z,y=cy+star.y*height*.3/z;
      if(x<0||x>width||y<0||y>height)continue;
      ctx.fillStyle=`rgba(178,228,144,${Math.min(.7,.22/z)})`;ctx.beginPath();ctx.arc(x,y,star.size/Math.max(z,.5),0,Math.PI*2);ctx.fill();
      if(current>.2&&current<.8){ctx.strokeStyle='rgba(155,233,190,.12)';ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+(x-cx)*.025,y+(y-cy)*.025);ctx.stroke();}
    }
  }
  function frame(timestamp){
    raf=0;if(!visible||document.hidden||off())return;
    const dt=lastTime?Math.min(.05,(timestamp-lastTime)/1000):0;lastTime=timestamp;time+=dt;
    current+=(target-current)*.11;if(Math.abs(target-current)<.0001)current=target;
    apply();paint();raf=requestAnimationFrame(frame);
  }
  function start(){if(!raf&&visible&&!document.hidden&&!off())raf=requestAnimationFrame(frame);}
  function scroll(){if(!off()){const distance=scrollScene.offsetHeight-stage.offsetHeight;target=Math.max(0,Math.min(1,-scrollScene.getBoundingClientRect().top/Math.max(1,distance)));start();}}
  buttons.forEach((b,i)=>b.addEventListener('click',()=>{
    const progress=[0,.5,1][i];
    if(off()){current=target=progress;apply();paint();}
    else {const top=scrollScene.getBoundingClientRect().top+scrollY;window.scrollTo({top:top+(scrollScene.offsetHeight-stage.offsetHeight)*progress,behavior:'smooth'});}
  }));
  stage.addEventListener('pointermove',e=>{if(off()||e.pointerType==='touch')return;const r=stage.getBoundingClientRect();mx=(e.clientX-r.left)/r.width-.5;my=(e.clientY-r.top)/r.height-.5;stage.style.setProperty('--px',mx);stage.style.setProperty('--py',my);});
  stage.addEventListener('pointerleave',()=>{stage.style.setProperty('--px',0);stage.style.setProperty('--py',0);});
  new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;if(visible)start();else{cancelAnimationFrame(raf);raf=0;lastTime=0;}},{threshold:0}).observe(stage);
  new MutationObserver(()=>{if(off()){cancelAnimationFrame(raf);raf=0;current=target=0;apply();paint();}else{scroll();start();}}).observe(document.documentElement,{attributes:true,attributeFilter:['class']});
  document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(raf);raf=0;lastTime=0;}else start();});
  addEventListener('resize',()=>{resize();scroll();});addEventListener('scroll',scroll,{passive:true});resize();apply();scroll();start();
  const techButtons=[...document.querySelectorAll('[data-tech]')];const techCards=[...document.querySelectorAll('[data-layer]')];
  techButtons.forEach(button=>button.addEventListener('click',()=>{
    techButtons.forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
    techCards.forEach((card,i)=>{card.hidden=button.dataset.tech!=='all'&&button.dataset.tech!==card.dataset.layer;if(!card.hidden&&!off())card.animate([{opacity:0,transform:'translateY(25px) rotateX(5deg)'},{opacity:1,transform:'none'}],{duration:600,delay:i*35,easing:'cubic-bezier(.22,1,.36,1)',fill:'backwards'});});
  }));
  document.querySelectorAll('.atlas-card a').forEach(a=>a.addEventListener('click',()=>document.querySelector('[data-filter="all"]').click()));
})();
