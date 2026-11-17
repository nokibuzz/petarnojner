(() => {
  const root = document.documentElement;
  const chapters = [...document.querySelectorAll('.life-chapter')];
  const scenes = [...document.querySelectorAll('.life-scene')];
  const bridges = [...document.querySelectorAll('.life-bridge')];
  const stages = [...document.querySelectorAll('.life-chapter, .life-bridge')];
  const fxCanvas = document.querySelector('.life-transition-canvas');
  const fx = fxCanvas.getContext('2d');
  let currentBridge = null, bridgeProgress = 0, bridgeStarted = 0;
  const links = [...document.querySelectorAll('.life-timeline a')];
  const next = document.querySelector('.life-next');
  const motion = document.querySelector('.life-motion');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const canvas = document.querySelector('#life-stars');
  const ctx = canvas.getContext('2d');
  let paused = false, active = -1, frame = 0, particleFrame = 0;
  let width = innerWidth, height = innerHeight, elapsed = 0, previous = 0;
  const off = () => paused || reduced.matches;
  const clamp = (n, min = 0, max = 1) => Math.min(max, Math.max(min, n));
  const particles = Array.from({length: 65}, (_, i) => ({x: ((i * 137.508) % 100) / 100, y: ((i * 73.913) % 100) / 100, radius: i % 6 === 0 ? 1.6 : .7, speed: .15 + (i % 5) * .08}));

  function paintPassage() {
    if (!fx) return;
    fx.clearRect(0, 0, width, height);
    if (!currentBridge || off()) return;
    const kind = currentBridge.dataset.bridge;
    const age = elapsed - bridgeStarted;
    const golden = kind === 'thread' || kind === 'heartbeat';
    const rgb = golden ? '236,209,151' : kind === 'covid' ? '158,206,210' : '199,243,109';
    fx.save();
    // Effects sit around the narrative; they never cover it with a bright flash.
    if (kind === 'meteor' || kind === 'launch') {
      for (let i = 0; i < 3; i++) {
        const p = (age * .3 + i * .32 + bridgeProgress * .25) % 1;
        const x = width * (.13 + p * .9), y = height * (.12 + p * .48 + i * .07);
        const tail = Math.min(width * .18, 200);
        const g = fx.createLinearGradient(x - tail, y - tail * .5, x, y);
        g.addColorStop(0, `rgba(${rgb},0)`); g.addColorStop(1, `rgba(${rgb},.65)`);
        fx.strokeStyle = g; fx.lineWidth = i === 0 ? 1.8 : .8;
        fx.beginPath(); fx.moveTo(x - tail, y - tail * .5); fx.lineTo(x, y); fx.stroke();
        fx.fillStyle = `rgba(${rgb},.85)`; fx.beginPath(); fx.arc(x, y, 2, 0, Math.PI * 2); fx.fill();
      }
    } else if (kind === 'pixels' || kind === 'code' || kind === 'pages') {
      for (let i = 0; i < 38; i++) {
        const p = (age * .12 + i * .093) % 1;
        const x = width * (.15 + ((i * .137 + p * .4) % .84));
        const y = height * (1 - p);
        const size = kind === 'pixels' ? 3 + i % 4 : kind === 'pages' ? 6 : 2;
        fx.fillStyle = `rgba(${rgb},${Math.sin(p * Math.PI) * .25})`;
        fx.save(); fx.translate(x, y); if (kind === 'pages') fx.rotate(p * 3 + i);
        fx.fillRect(0, 0, size, kind === 'pages' ? size * 1.4 : size); fx.restore();
      }
    } else if (kind === 'covid') {
      for (let i = 0; i < 7; i++) {
        const x = width * (.15 + (i * .147) % .8) + Math.sin(age * .2 + i) * 15;
        const y = height * (.12 + (i * .231) % .75) + Math.cos(age * .15 + i) * 15;
        const r = 6 + i % 3 * 4;
        fx.strokeStyle = `rgba(${rgb},.12)`; fx.lineWidth = 1;
        fx.beginPath(); fx.arc(x, y, r, 0, Math.PI * 2); fx.stroke();
        for (let j = 0; j < 8; j++) {
          const a = j * Math.PI / 4 + age * .06;
          fx.beginPath(); fx.moveTo(x + Math.cos(a) * r, y + Math.sin(a) * r);
          fx.lineTo(x + Math.cos(a) * (r + 5), y + Math.sin(a) * (r + 5)); fx.stroke();
        }
      }
    } else if (kind === 'thread') {
      const x0 = width * .2, y0 = height * .8, x1 = width * .9, y1 = height * .18;
      fx.strokeStyle = `rgba(${rgb},.13)`; fx.lineWidth = 1;
      fx.beginPath(); fx.moveTo(x0, y0); fx.bezierCurveTo(width * .75, height, width * .3, 0, x1, y1); fx.stroke();
      for (let i = 0; i < 18; i++) {
        const t = (age * .08 + i / 18) % 1, u = 1 - t;
        const x = u*u*u*x0 + 3*u*u*t*width*.75 + 3*u*t*t*width*.3 + t*t*t*x1;
        const y = u*u*u*y0 + 3*u*u*t*height + t*t*t*y1;
        fx.fillStyle = `rgba(${rgb},${.1 + Math.sin(t * Math.PI) * .4})`;
        fx.beginPath(); fx.arc(x, y, 1.5, 0, Math.PI * 2); fx.fill();
      }
    } else if (kind === 'heartbeat') {
      const p = (age * .4) % 1;
      fx.strokeStyle = `rgba(${rgb},${.18 * (1-p)})`; fx.lineWidth = 1;
      fx.beginPath(); fx.arc(width * .76, height * .4, 30 + p * 150, 0, Math.PI * 2); fx.stroke();
    }
    fx.restore();
  }
  function paint() {
    paintPassage();
    if (!ctx) return;
    ctx.clearRect(0, 0, width, height);
    particles.forEach((p, i) => {
      const x = (p.x * width + Math.sin(elapsed * .07 + i) * 9);
      const y = (p.y * height - elapsed * p.speed * 3 + height) % height;
      ctx.fillStyle = `rgba(194,224,173,${.14 + (Math.sin(elapsed * .3 + i) + 1) * .15})`;
      ctx.beginPath(); ctx.arc(x, y, p.radius, 0, Math.PI * 2); ctx.fill();
    });
  }
  function animate(time) {
    particleFrame = 0;
    if (off() || document.hidden) return;
    if (previous) elapsed += Math.min((time - previous) / 1000, .05);
    previous = time; paint(); particleFrame = requestAnimationFrame(animate);
  }
  function startParticles() {
    if (!particleFrame && !off() && !document.hidden) particleFrame = requestAnimationFrame(animate);
  }
  function resize() {
    width = innerWidth; height = innerHeight;
    const dpr = Math.min(devicePixelRatio || 1, 1.5);
    canvas.width = width * dpr; canvas.height = height * dpr;
    ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
    fxCanvas.width = width * dpr; fxCanvas.height = height * dpr;
    fx?.setTransform(dpr, 0, 0, dpr, 0, 0); paint(); schedule();
  }
  function select(index) {
    if (index === active) return;
    active = index;
    scenes.forEach((scene, i) => scene.classList.toggle('is-active', i === index));
    chapters.forEach((chapter, i) => {
      chapter.classList.toggle('is-active', i === index);
      chapter.inert = width <= 700 && i !== index;
    });
    links.forEach((link, i) => {
      if (i === index) link.setAttribute('aria-current', 'step');
      else link.removeAttribute('aria-current');
      link.classList.toggle('is-past', i < index);
    });
    document.querySelector('.visual-year').textContent = chapters[index].id.slice(5);
    document.querySelector('.current-chapter').textContent = String(index + 1).padStart(2, '0');
    const last = index === chapters.length - 1;
    next.href = last ? 'index.html#about' : `#${chapters[index + 1].id}`;
    next.innerHTML = last ? 'BACK TO PORTFOLIO <span>↗</span>' : 'NEXT CHAPTER <span>↓</span>';
    next.setAttribute('aria-label', last ? 'Back to portfolio' : `Next chapter: ${links[index + 1].querySelector('.life-nav-label').textContent}`);
    const color = chapters[index].dataset.color;
    root.style.setProperty('--accent', color === 'gold' ? '#ecd197' : color === 'blue' ? '#a7d6d9' : '#c7f36d');
  }
  function update() {
    frame = 0;
    const mobile = width <= 700;
    const focus = height * .5;
    let nearest = stages[0], distance = Infinity;
    // Sections, including the short passages, remain native scroll destinations.
    stages.forEach(stage => {
      const rect = stage.getBoundingClientRect();
      const delta = Math.abs(rect.top + rect.height * .5 - focus);
      if (delta < distance) {distance = delta; nearest = stage;}
    });
    const bridge = nearest.matches('.life-bridge') ? nearest : null;
    if (bridge !== currentBridge) {
      currentBridge = bridge; bridgeStarted = elapsed;
      root.classList.toggle('is-between-chapters', !!bridge);
      root.dataset.passage = bridge?.dataset.bridge || '';
      bridges.forEach(item => item.classList.toggle('is-active', item === bridge));
    }
    const index = bridge ? Number(bridge.dataset.from) : Number(nearest.dataset.index);
    select(index);
    // Only the current mobile text can receive focus; passage text stays readable to AT.
    chapters.forEach((chapter, i) => {chapter.inert = mobile && (!!bridge || i !== active);});
    bridges.forEach(item => {item.inert = mobile && item !== bridge;});
    chapters.forEach(chapter => {
      const rect = chapter.getBoundingClientRect();
      const copy = chapter.querySelector('.chapter-copy');
      const local = (rect.top + rect.height * .5 - focus) / height;
      copy.style.setProperty('--copy-shift', off() || mobile ? '0px' : `${clamp(local, -1, 1) * 30}px`);
      copy.style.setProperty('--copy-opacity', off() ? '1' : String(clamp(1.35 - Math.abs(local) * .7, .12, 1)));
    });
    if (bridge) {
      const rect = bridge.getBoundingClientRect();
      bridgeProgress = clamp((height - rect.top) / (height + rect.height));
      bridge.style.setProperty('--passage-travel', off() ? '0px' : `${(bridgeProgress - .5) * -38}px`);
    }
    const rect = chapters[active].getBoundingClientRect();
    const travel = off() ? 0 : clamp((focus - rect.top) / rect.height) - .5;
    scenes[active].style.setProperty('--art-y', `${travel * (mobile ? 16 : 65)}px`);
    scenes[active].style.setProperty('--art-rotate', `${travel * 7}deg`);
    scenes[active].style.setProperty('--art-scale', String(1 + Math.abs(travel) * .085));
    const max = document.documentElement.scrollHeight - height;
    document.querySelector('.life-progress>span').style.transform = `scaleX(${max ? clamp(scrollY / max) : 0})`;
    paintPassage();
  }
  function schedule() {if (!frame) frame = requestAnimationFrame(update);}
  function syncMotion() {
    root.classList.toggle('life-paused', off());
    motion.setAttribute('aria-pressed', String(off()));
    motion.disabled = reduced.matches;
    motion.innerHTML = off() ? 'Motion paused <span>▷</span>' : 'Pause motion <span>Ⅱ</span>';
    motion.title = reduced.matches ? 'Reduced motion follows your device preference' : 'Pause or resume decorative motion';
    cancelAnimationFrame(particleFrame); particleFrame = 0; previous = 0;
    if (off()) paint(); else startParticles();
    schedule();
  }
  function navigate(chapter, smooth = true) {
    const top = chapter.offsetTop + (width <= 700 ? 0 : (chapter.offsetHeight - height) / 2);
    window.scrollTo({top, behavior: smooth && !off() ? 'smooth' : 'instant'});
  }
  document.querySelectorAll('a[href^="#year-"]').forEach(link => {
    link.addEventListener('click', event => {
      const href = link.getAttribute('href');
      if (!href.startsWith('#year-')) return; // The final next link returns to the portfolio.
      const chapter = document.getElementById(href.slice(1));
      if (!chapter) return;
      event.preventDefault();
      if (location.hash !== href) history.pushState(null, '', href);
      navigate(chapter);
    });
  });
  motion.addEventListener('click', () => {paused = !paused; syncMotion();});
  reduced.addEventListener('change', syncMotion);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {cancelAnimationFrame(particleFrame); particleFrame = 0; previous = 0;}
    else startParticles();
  });
  addEventListener('resize', resize);
  addEventListener('scroll', schedule, {passive: true});
  addEventListener('hashchange', schedule);
  document.fonts?.ready.then(() => {
    const chapter = chapters.find(item => `#${item.id}` === location.hash);
    if (chapter) navigate(chapter, false);
    schedule();
  });
  resize(); syncMotion(); update();
})();
