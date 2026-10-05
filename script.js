const hero = document.querySelector('#hero');

if (hero && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  hero.addEventListener('pointermove', (event) => {
    const x = (event.clientX / window.innerWidth - 0.5) * -12;
    const y = (event.clientY / window.innerHeight - 0.5) * -8;
    hero.style.setProperty('--mx', `${x}px`);
    hero.style.setProperty('--my', `${y}px`);
  });
}
