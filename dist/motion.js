const root = document.documentElement;
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
let userPaused = false;
const motionOff = () => userPaused || reduceMotion.matches;
const toggle = document.querySelector('.motion-toggle');
function syncMotion() {
  root.classList.toggle('motion-paused', motionOff());
  toggle.setAttribute('aria-pressed', String(motionOff()));
  toggle.disabled = reduceMotion.matches;
  toggle.title = reduceMotion.matches ? 'Reduced motion follows your device preference' : 'Pause or resume decorative animation';
  toggle.innerHTML = motionOff() ? 'Motion paused <span aria-hidden="true">▷</span>' : 'Pause motion <span aria-hidden="true">Ⅱ</span>';
}
toggle.addEventListener('click', () => {userPaused = !userPaused; syncMotion();});
reduceMotion.addEventListener('change', syncMotion);
syncMotion();
// Preserve semantic heading markup while revealing each word.
const heading = document.querySelector('.hero h1');
let wordIndex = 0;
function wrapWords(node) {
  [...node.childNodes].forEach(child => {
    if (child.nodeType === Node.TEXT_NODE) {
      const fragment = document.createDocumentFragment();
      child.textContent.split(/(\s+)/).forEach(part => {
        if (!part.trim()) {fragment.append(document.createTextNode(part));return;}
        const wrap = document.createElement('span'); wrap.className = 'word-wrap';
        const word = document.createElement('span'); word.className = 'word';word.textContent = part;word.style.setProperty('--i',wordIndex++);wrap.append(word);fragment.append(wrap);
      });child.replaceWith(fragment);
    } else if (child.nodeType === Node.ELEMENT_NODE) wrapWords(child);
  });
}
wrapWords(heading);
const reveals = document.querySelectorAll('.intro-band > div, .section-topline, .project-card, .expertise-item, .timeline-item, .experience-heading, .testimonial, .contact-inner');
const observer = new IntersectionObserver(entries => entries.forEach(entry => {
  entry.target.classList.toggle('in-view', entry.isIntersecting);
}), {threshold:.07,rootMargin:'0px 0px -20px 0px'});
reveals.forEach((el,i) => {el.classList.add('reveal'); el.style.setProperty('--delay',`${i % 2 * 75}ms`);observer.observe(el);});
root.classList.add('motion-ready');
const ticker = document.querySelector('.ticker-track');
const tickerClone = ticker.cloneNode(true);tickerClone.setAttribute('aria-hidden','true');ticker.after(tickerClone);
addEventListener('scroll',()=>{const max=document.documentElement.scrollHeight-innerHeight;document.querySelector('.reading-progress').style.transform=`scaleX(${max>0?scrollY/max:0})`;},{passive:true});
const cases=[
 ['A team workspace across existing tools','Sprint work, code reviews and documentation live in different systems. UniteDesk brings that context into a shared view.','Designed and built the React/TypeScript workspace and Node.js provider integrations. Added Scrum Poker and retrospectives with voting, actions and PDF reports.','The public demo is available with synthetic data. Connected tools and shared sessions are supported by the local server. This is an independent open-source project.'],
 ['Connected agriculture','A US agriculture project involving smart tractors that navigate fields, recognize obstacles and support remote operation.','Contributed to a system combining autonomous tractor navigation, obstacle recognition, field selection and remote-control operation.','Professional client project in US agriculture. The portfolio illustration explains the domain; technical details can be discussed within client confidentiality boundaries.'],
 ['High-volume betting events','The platform needed event processing with attention to low latency and data integrity.','Designed and implemented a Kafka Streams service using Java, and supported production investigation using Splunk and Grafana.','Production engineering experience at Hooloovoo on the Kindred platform, documented in my CV. Source code and internal operational data are private.'],
 ['Engineering the agent workflow','AI coding tools need an explicit process around task intake, execution, verification and review.','Built an interactive visual prototype exploring workflow graphs, model routing, isolated workers, review and merge policy. Documented a staged path toward implementation.','This is a local simulation and research prototype. It does not autonomously operate repositories or represent a deployed agent fleet.'],
 ['A useful AI concierge','Visitors need plans grounded in available tours, their time window and weather.','Built an Agentplace demo with a server-side TypeScript tool calling Open-Meteo. Designed short plans with sources, expandable details and alternatives.','A public independent demo based on a tour operator’s published schedule. It is not a commissioned tour-operator system.'],
 ['A booking product from scratch','Pet owners need to find a suitable stay, and vendors need availability and reservations represented correctly.','Built web and mobile booking flows with Next.js and React, handled product decisions and marketing, and spoke with potential customers at veterinary conferences.','Founder project from August 2024 to March 2025. The startup is currently paused; public source is linked on the project card.'],
 ['Visibility into engineering delivery','Release work and code reviews can become difficult to track across repositories.','Built a dashboard with merge requests, pipeline status and filters for author, component and release flow.','Internal engineering tool. This portfolio uses a conceptual illustration and excludes private URLs, source and screenshots.'],
 ['Pitwall Race Companion','What changes if a driver pits now, stays out, or moves a stop to a different lap?','Built a race companion with driver selection, historical race exploration and conditional strategy comparison. The private version includes an AI agent and authenticated API integrations.','The linked public demo uses recorded race snapshots and a scenario engine with deterministic explanations. It is separate from the private AI/API version. Scenario results are conditional estimates, not guaranteed outcomes.']
];
const dialog=document.querySelector('.case-dialog');let lastCaseButton;
document.querySelectorAll('.project-card').forEach((card,i)=>{
 card.id=`project-${i}`;card.style.scrollMarginTop='35px';
 const button=document.createElement('button');button.className='case-open';button.textContent='My contribution +';button.setAttribute('aria-label',`Read about my contribution to ${card.querySelector('h3').textContent}`);
 card.querySelector('.project-links').prepend(button);
 button.addEventListener('click',()=>{
  lastCaseButton=button;dialog.querySelector('h2').textContent=cases[i][0];
  const content=dialog.querySelector('.case-content');content.replaceChildren();
  ['The problem','My contribution','Evidence & status'].forEach((title,j)=>{const h=document.createElement('h3');h.textContent=title;const p=document.createElement('p');p.textContent=cases[i][j+1];content.append(h,p);});
  card.querySelectorAll('.project-links a').forEach(a=>content.append(a.cloneNode(true),document.createTextNode('   ')));
  dialog.showModal();document.body.style.overflow='hidden';
 });
});
dialog.querySelector('.case-close').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
dialog.addEventListener('close',()=>{document.body.style.overflow='';lastCaseButton?.focus({preventScroll:true});});
// Selecting a project from the toolkit restores the full project list.

document.querySelectorAll('.filter').forEach(button=>button.addEventListener('click',()=>{
 if(motionOff())return;
 document.querySelectorAll('.project-card:not([hidden])').forEach((card,i)=>card.animate([{opacity:0,translate:'0 25px'},{opacity:1,translate:'0 0'}],{duration:550,delay:Math.min(i*60,240),easing:'cubic-bezier(.22,1,.36,1)',fill:'backwards'}));
}));
