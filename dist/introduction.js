(() => {
  const player = document.querySelector('.film-player');
  const poster = document.querySelector('.film-poster');
  const close = document.querySelector('.film-stop');
  const caption = document.querySelector('.film-foot>span');
  if (!player || !poster || !close) return;
  poster.addEventListener('click', () => {
    const iframe = document.createElement('iframe');
    iframe.src = 'https://www.youtube-nocookie.com/embed/PLa2YgZjj7Y?autoplay=1&rel=0';
    iframe.title = 'Petar Nojner — Portfolio Introduction';
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
    iframe.allowFullscreen = true;
    iframe.referrerPolicy = 'strict-origin-when-cross-origin';
    player.replaceChildren(iframe);
    close.hidden = false;
    caption.textContent = 'PETAR NOJNER / VIDEO INTRODUCTION';
    iframe.focus();
  });
  close.addEventListener('click', () => {
    player.replaceChildren(poster);
    close.hidden = true;
    caption.textContent = "PRESS PLAY WHEN YOU'RE READY";
    poster.focus({preventScroll: true});
  });
})();
