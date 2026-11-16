(() => {
  const root=document.documentElement;
  const preference=matchMedia('(prefers-reduced-motion: reduce)');
  const off=()=>root.classList.contains('motion-paused')||preference.matches;
  const clamp=value=>Math.max(0,Math.min(1,value));
  document.querySelectorAll('.tags,.atlas-card ul,.workshop-topics').forEach(group=>[...group.children].forEach((item,i)=>item.style.setProperty('--tag-i',i)));
  const inks=[];
  document.querySelectorAll('#intro-title,#work-title,#experience-title,#review-title,#contact-title,#workshops-title').forEach(el=>{
    el.setAttribute('aria-label',el.textContent);
    function split(node){[...node.childNodes].forEach(child=>{
      if(child.nodeType===Node.TEXT_NODE){const fragment=document.createDocumentFragment();child.textContent.split(/(\s+)/).forEach(part=>{
        if(!part.trim()){fragment.append(document.createTextNode(part));return;}
        const word=document.createElement('span');word.className='ink-word';word.setAttribute('aria-hidden','true');
        [...part].forEach(letter=>{const glyph=document.createElement('span');glyph.className='ink-char';glyph.textContent=letter;word.append(glyph);});fragment.append(word);
      });child.replaceWith(fragment);}else if(child.nodeType===Node.ELEMENT_NODE)split(child);
    });}
    split(el);inks.push({el,chars:[...el.querySelectorAll('.ink-char')]});
  });
  const timeline=document.querySelector('.timeline');const review=document.querySelector('.testimonial');
  let scheduled=false;
  function updateScroll(){
    scheduled=false;
    inks.forEach(({el,chars})=>{const r=el.getBoundingClientRect();if(r.bottom<0||r.top>innerHeight)return;const progress=off()?1:clamp((innerHeight*.87-r.top)/(innerHeight*.62));chars.forEach((c,i)=>c.classList.toggle('inked',progress>=(i+1)/chars.length));});
    const t=timeline.getBoundingClientRect();timeline.style.setProperty('--timeline-progress',off()?1:clamp((innerHeight*.7-t.top)/t.height));
    const r=review.getBoundingClientRect();review.style.setProperty('--section-progress',off()?1:clamp((innerHeight-r.top)/(innerHeight*.7)));
  }
  const schedule=()=>{if(!scheduled){scheduled=true;requestAnimationFrame(updateScroll);}};
  addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule);
  const revealObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{
    entry.target.classList.toggle('section-visible',entry.isIntersecting);
    if(entry.target.matches('.technology-atlas')&&!entry.isIntersecting)stopTrace();
  }),{threshold:.05});
  document.querySelectorAll('.atlas-card,.archive-card,.workshops,.contact,.technology-atlas,.employer-group').forEach((el,i)=>{
    if(el.matches('.atlas-card')){el.classList.add('section-reveal');el.style.setProperty('--entry-x',`${i%2?30:-30}px`);el.style.setProperty('--entry-r',`${i%2?2:-2}deg`);el.style.setProperty('--entry-delay',`${i%3*70}ms`);}
    revealObserver.observe(el);
  });
  document.querySelectorAll('.atlas-card').forEach(card=>card.addEventListener('pointermove',e=>{if(off()||e.pointerType==='touch')return;const r=card.getBoundingClientRect();card.style.setProperty('--spot-x',`${e.clientX-r.left}px`);card.style.setProperty('--spot-y',`${e.clientY-r.top}px`);}));
  const decisions={
    frontend:{label:'01 / PRODUCT INTERFACE',title:'A useful action starts with a clear interface.',text:"React and TypeScript turn a user's intent into an explicit request, with loading, failure and success states.",code:'user intent → typed request → visible outcome',link:'#project-0',cta:'See it in UniteDesk ↗'},
    backend:{label:'02 / SERVICE BOUNDARY',title:'Make the business rules explicit.',text:'Java and Spring Boot provide the service boundary. Kafka Streams supports event-driven work where order, throughput and data integrity matter.',code:'request → validation → business rules → event',link:'#project-2',cta:'See production event processing ↗'},
    data:{label:'03 / DATA MODEL',title:'Choose the model around the problem.',text:'PostgreSQL for relational structure, MongoDB for document models, Redis for caching, and Neo4j when relationships are central. The choice follows access patterns and consistency needs.',code:'access pattern → model → consistency → query',link:'#about',cta:'Explore my database experience ↗'},
    cloud:{label:'04 / DELIVERY',title:'Build a repeatable path to release.',text:'Containers, CI/CD and AWS services connect implementation to deployment. My AWS toolkit includes EC2, S3, ECR, CodeBuild and Lambda.',code:'commit → build → checks → artifact → deployment',link:'#about',cta:'See my cloud delivery experience ↗'},
    quality:{label:'05 / OBSERVABILITY',title:'Know what happened after release.',text:'Logs, dashboards and automated checks help explain failures and verify changes. I have investigated production incidents with Splunk and Grafana.',code:'observe → investigate → fix → verify',link:'#project-2',cta:'See production engineering ↗'},
    ai:{label:'06 / AGENT WORKFLOW',title:'Give the agent a process it can follow.',text:'An agent works inside a harness: tools through MCP, explicit graph steps, evaluation and review loops. Harness Lab explores the workflow; Pitwall applies agent reasoning to race strategy in its private version.',code:'goal → graph → tools → evaluate → review ↺',link:'#project-7',cta:'Explore Pitwall Race Companion ↗'}
  };
  const nodes=[...document.querySelectorAll('[data-node]')],detail=document.querySelector('.lab-detail'),traceButton=document.querySelector('.trace-run');
  let traceTimer=null,traceRunning=false,traceStep=0;
  function setLayer(key){const data=decisions[key];if(!data)return;
    nodes.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.node===key)));
    detail.querySelector('.lab-caption').textContent=data.label;detail.querySelector('h3').textContent=data.title;detail.querySelector('p').textContent=data.text;detail.querySelector('code').textContent=data.code;detail.querySelector('a').href=data.link;detail.querySelector('a').textContent=data.cta;
    if(!off()){detail.getAnimations().forEach(a=>a.cancel());detail.animate([{opacity:.2,transform:'translateY(12px)'},{opacity:1,transform:'none'}],{duration:420,easing:'ease-out'});}
  }
  function stopTrace(){clearTimeout(traceTimer);traceTimer=null;traceRunning=false;traceButton.innerHTML='Walk through the system <span aria-hidden="true">↗</span>';traceButton.setAttribute('aria-pressed','false');}
  function stepTrace(){if(!traceRunning||off()||document.hidden){stopTrace();return;}setLayer(nodes[traceStep].dataset.node);traceStep++;if(traceStep<nodes.length)traceTimer=setTimeout(stepTrace,1800);else traceTimer=setTimeout(stopTrace,1800);}
  traceButton.addEventListener('click',()=>{if(traceRunning){stopTrace();return;}if(off()){setLayer('ai');return;}traceRunning=true;traceStep=0;traceButton.textContent='Stop walkthrough Ⅱ';traceButton.setAttribute('aria-pressed','true');stepTrace();});
  nodes.forEach(node=>node.addEventListener('click',()=>{stopTrace();document.querySelector(`[data-tech="${node.dataset.node}"]`).click();}));
  document.querySelectorAll('[data-tech]').forEach(button=>button.addEventListener('click',()=>{stopTrace();if(button.dataset.tech!=='all')setLayer(button.dataset.tech);}));
  detail.querySelector('a').addEventListener('click',()=>document.querySelector('[data-filter="all"]').click());
  const inquiries={
    product:{question:'What are you building, who is it for, and what should the first version do?',subject:'Product collaboration',body:'Hi Petar,\n\nI would like to discuss a product.\n\nWhat we are building:\nWho it is for:\nThe first milestone:\n\n'},
    systems:{question:'What is slowing the system down — reliability, architecture, delivery or a difficult backend problem?',subject:'System improvement',body:'Hi Petar,\n\nI would like help with an existing system.\n\nCurrent stack:\nThe problem:\nWhat a useful outcome looks like:\n\n'},
    ai:{question:'Which workflow should AI help with, what tools or data can it use, and how will we judge a useful result?',subject:'AI workflow collaboration',body:'Hi Petar,\n\nI would like to explore an AI workflow.\n\nThe workflow:\nAvailable tools and data:\nWhat a useful result looks like:\n\n'},
    workshop:{question:'Who is the workshop for, and which technical or team skill would make the biggest difference?',subject:'IT and HR workshop',body:'Hi Petar,\n\nI would like to discuss a workshop.\n\nAudience:\nTopics:\nDesired outcome:\n\n'}
  };
  const inquiryBox=document.querySelector('.inquiry-preview'),launch=document.querySelector('.contact-launch');
  function chooseInquiry(key){const data=inquiries[key];document.querySelectorAll('[data-inquiry]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.inquiry===key)));inquiryBox.querySelector('p').textContent=data.question;
    const href=`mailto:nojner.petar@gmail.com?subject=${encodeURIComponent(data.subject)}&body=${encodeURIComponent(data.body)}`;inquiryBox.querySelector('a').href=href;launch.href=href;
    if(!off())inquiryBox.animate([{opacity:.4,transform:'translateY(10px)'},{opacity:1,transform:'none'}],{duration:350,easing:'ease-out'});
  }
  document.querySelectorAll('[data-inquiry]').forEach(b=>b.addEventListener('click',()=>chooseInquiry(b.dataset.inquiry)));
  chooseInquiry('product');
  launch.addEventListener('pointermove',e=>{if(off()||e.pointerType==='touch')return;const r=launch.getBoundingClientRect();launch.style.setProperty('--magnet-x',`${(e.clientX-r.left-r.width/2)*.15}px`);launch.style.setProperty('--magnet-y',`${(e.clientY-r.top-r.height/2)*.15}px`);});
  launch.addEventListener('pointerleave',()=>{launch.style.setProperty('--magnet-x','0px');launch.style.setProperty('--magnet-y','0px');});
  new MutationObserver(()=>{if(off()){stopTrace();[detail,inquiryBox].forEach(el=>el.getAnimations().forEach(animation=>animation.cancel()));}schedule();}).observe(root,{attributes:true,attributeFilter:['class']});
  document.addEventListener('visibilitychange',()=>{if(document.hidden)stopTrace();});
  root.classList.add('sections-ready');updateScroll();
})();
