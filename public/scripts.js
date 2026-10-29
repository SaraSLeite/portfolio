// Animações de entrada progressivas, respeitando a preferência por movimento reduzido.
const sections = document.querySelectorAll('main > section');
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });
  sections.forEach((section) => observer.observe(section));
} else {
  sections.forEach((section) => section.classList.add('active'));
}

// Tema escuro por padrão, com preferência salva no navegador.
const themeButton = document.getElementById('tema');
const themeIcon = themeButton?.querySelector('span');
function applyTheme(theme) {
  const light = theme === 'light';
  document.body.classList.toggle('light-theme', light);
  if (themeIcon) themeIcon.textContent = light ? 'dark_mode' : 'light_mode';
  themeButton?.setAttribute('aria-label', light ? 'Ativar tema escuro' : 'Ativar tema claro');
}
applyTheme(localStorage.getItem('temaPortfolio') || 'dark');
themeButton?.addEventListener('click', () => {
  const next = document.body.classList.contains('light-theme') ? 'dark' : 'light';
  localStorage.setItem('temaPortfolio', next);
  applyTheme(next);
});

// Leitura em voz alta da apresentação.
const readButton = document.getElementById('lerTexto');
readButton?.addEventListener('click', () => {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const text = document.querySelector('.hero-description')?.textContent + ' ' + document.querySelector('.intro-copy')?.innerText;
  const speech = new SpeechSynthesisUtterance(text);
  speech.lang = 'pt-BR'; speech.rate = 1; speech.pitch = 1;
  window.speechSynthesis.speak(speech);
});

// Menu responsivo.
const menuToggle = document.getElementById('menuToggle');
const menu = document.getElementById('menu');
menuToggle?.addEventListener('click', () => {
  const opened = menu?.classList.toggle('is-open') ?? false;
  menuToggle.setAttribute('aria-expanded', String(opened));
  const icon = menuToggle.querySelector('span');
  if (icon) icon.textContent = opened ? 'close' : 'menu';
});
menu?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  menu.classList.remove('is-open');
  menuToggle?.setAttribute('aria-expanded', 'false');
  const icon = menuToggle?.querySelector('span');
  if (icon) icon.textContent = 'menu';
}));

// Linha do tempo: setas e roda do mouse, além de swipe nativo em dispositivos móveis.
const timeline = document.getElementById('timeline');
document.getElementById('timelinePrev')?.addEventListener('click', () => timeline?.scrollBy({ left: -250, behavior: 'smooth' }));
document.getElementById('timelineNext')?.addEventListener('click', () => timeline?.scrollBy({ left: 250, behavior: 'smooth' }));
timeline?.addEventListener('wheel', (event) => {
  if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) {
    event.preventDefault();
    timeline.scrollLeft += event.deltaY;
  }
}, { passive: false });

// Galeria interativa dos projetos.
const galleryModal = document.getElementById('galleryModal');
const galleryTitle = document.getElementById('galleryTitle');
const galleryDescription = document.getElementById('galleryDescription');
const galleryCounter = document.getElementById('galleryCounter');
const galleryImage = document.getElementById('galleryImage');
const galleryDots = document.getElementById('galleryDots');
const galleryStage = document.getElementById('galleryStage');
const galleryPrev = document.getElementById('galleryPrev');
const galleryNext = document.getElementById('galleryNext');
const galleryGithub = document.getElementById('galleryGithub');

const projectGalleries = {
  srlitflix: {
    title: 'SrlitFlix',
    description: 'Aplicação de busca e descoberta de filmes e séries, com interface própria e integração com catálogo de títulos.',
    github: 'https://github.com/SaraSLeite',
    images: [
      { src: 'img/projects/srlitflix-busca.png', alt: 'Tela de pesquisa do SrlitFlix, com campo de busca em destaque.' },
      { src: 'img/projects/srlitflix-catalogo.png', alt: 'Catálogo do SrlitFlix com fileiras de filmes e séries em destaque.' },
      { src: 'img/projects/srlitflix-destaque.png', alt: 'Tela inicial do SrlitFlix com destaque para uma série e navegação por setas.' }
    ]
  },
  gcook: {
    title: 'GCook',
    description: 'Projeto web de receitas e exploração culinária. A galeria será preenchida com as capturas de tela do projeto assim que você as enviar.',
    github: 'https://github.com/SaraSLeite',
    images: []
  },
  saae: {
    title: 'Sistemas internos · SAAE',
    description: 'Interfaces web para cadastro e inspeção de Poços de Visita (PV), com formulários para redes de água e esgoto, localização, coordenadas e registro visual por croqui e fotografias.',
    github: 'https://github.com/SaraSLeite',
    images: [
      { src: 'img/projects/saae/saae-inicio.png', alt: 'Tela inicial da Ficha de Inspeção de Poço de Visita, com opções para PV de água, PV de esgoto, registros e consulta de cadastros.' },
      { src: 'img/projects/saae/saae-pv-esgoto.png', alt: 'Formulário PV de Esgoto com campos de identificação, município, responsável e localização.' },
      { src: 'img/projects/saae/saae-croqui-fotos.png', alt: 'Seção do formulário com coordenadas, entradas e saídas, editor de croqui e área para adicionar fotografias.' }
    ]
  }
};
let activeGallery = null;
let activeGalleryIndex = 0;
let previousFocus = null;

function renderGallery() {
  if (!activeGallery) return;
  const images = activeGallery.images;
  const hasImages = images.length > 0;
  galleryTitle.innerHTML = `${activeGallery.title}<span>.</span>`;
  galleryDescription.textContent = activeGallery.description;
  galleryGithub.href = activeGallery.github;
  galleryImage.hidden = !hasImages;
  galleryPrev.hidden = !hasImages;
  galleryNext.hidden = !hasImages;
  galleryDots.replaceChildren();
  galleryStage.classList.toggle('gallery-empty', !hasImages);

  if (!hasImages) {
    galleryStage.querySelector('.gallery-empty-message')?.remove();
    const message = document.createElement('div');
    message.className = 'gallery-empty-message';
    message.innerHTML = '<span>IMAGENS EM BREVE</span><strong>Esta galeria está sendo preparada.</strong><p>Quando você enviar as capturas deste projeto, elas aparecerão aqui para navegar.</p>';
    galleryStage.append(message);
    galleryCounter.textContent = 'EM BREVE';
    return;
  }
  galleryStage.querySelector('.gallery-empty-message')?.remove();
  activeGalleryIndex = (activeGalleryIndex + images.length) % images.length;
  const image = images[activeGalleryIndex];
  galleryImage.src = image.src;
  galleryImage.alt = image.alt;
  galleryCounter.textContent = `${String(activeGalleryIndex + 1).padStart(2, '0')} / ${String(images.length).padStart(2, '0')}`;
  images.forEach((item, index) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'gallery-dot' + (index === activeGalleryIndex ? ' is-active' : '');
    dot.setAttribute('aria-label', `Ver imagem ${index + 1}`);
    dot.setAttribute('aria-current', index === activeGalleryIndex ? 'true' : 'false');
    dot.addEventListener('click', () => { activeGalleryIndex = index; renderGallery(); });
    galleryDots.append(dot);
  });
}
function openGallery(projectKey) {
  const project = projectGalleries[projectKey];
  if (!project || !galleryModal) return;
  previousFocus = document.activeElement;
  activeGallery = project;
  activeGalleryIndex = 0;
  renderGallery();
  galleryModal.classList.add('is-open');
  galleryModal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('gallery-is-open');
  galleryModal.querySelector('.gallery-close')?.focus();
}
function closeGallery() {
  if (!galleryModal) return;
  galleryModal.classList.remove('is-open');
  galleryModal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('gallery-is-open');
  previousFocus?.focus?.();
}
function moveGallery(direction) {
  if (!activeGallery?.images.length) return;
  activeGalleryIndex = (activeGalleryIndex + direction + activeGallery.images.length) % activeGallery.images.length;
  renderGallery();
}
document.querySelectorAll('[data-project]').forEach((button) => button.addEventListener('click', () => openGallery(button.dataset.project)));
galleryModal?.querySelectorAll('[data-gallery-close]').forEach((element) => element.addEventListener('click', closeGallery));
galleryPrev?.addEventListener('click', () => moveGallery(-1));
galleryNext?.addEventListener('click', () => moveGallery(1));
document.addEventListener('keydown', (event) => {
  if (!galleryModal?.classList.contains('is-open')) return;
  if (event.key === 'Escape') closeGallery();
  if (event.key === 'ArrowLeft') moveGallery(-1);
  if (event.key === 'ArrowRight') moveGallery(1);
});
let touchStartX = 0;
galleryStage?.addEventListener('touchstart', (event) => { touchStartX = event.changedTouches[0].clientX; }, { passive: true });
galleryStage?.addEventListener('touchend', (event) => {
  const delta = event.changedTouches[0].clientX - touchStartX;
  if (Math.abs(delta) > 45) moveGallery(delta < 0 ? 1 : -1);
}, { passive: true });


// Mascote: pisca em intervalos variáveis e sorri ao interagir.
(() => {
  const mascot = document.getElementById('srlitMascot');
  const button = document.getElementById('srlitMascotButton');
  const image = document.getElementById('srlitMascotImage');
  if (!mascot || !button || !image) return;

  const expressions = {
    normal: 'img/srlitPerson/normal.png',
    happy: 'img/srlitPerson/feliz.png',
    blink: 'img/srlitPerson/piscando.png',
    happyBlink: 'img/srlitPerson/feliz-piscando.png'
  };
  let hovered = false;
  let timer = null;
  let isBlinking = false;

  function showExpression(expression) {
    const nextSrc = expressions[expression] || expressions.normal;
    if (image.getAttribute('src') !== nextSrc) image.src = nextSrc;
    image.dataset.expression = expression;
  }

  function scheduleBlink() {
    window.clearTimeout(timer);
    if (hovered || document.hidden || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      timer = window.setTimeout(scheduleBlink, 2500);
      return;
    }
    timer = window.setTimeout(() => {
      isBlinking = true;
      showExpression('blink');
      window.setTimeout(() => {
        isBlinking = false;
        showExpression(hovered ? 'happy' : 'normal');
        scheduleBlink();
      }, 160);
    }, 2400 + Math.random() * 2600);
  }

  button.addEventListener('pointerenter', () => {
    hovered = true;
    window.clearTimeout(timer);
    showExpression('happy');
  });
  button.addEventListener('pointerleave', () => {
    hovered = false;
    if (!isBlinking) showExpression('normal');
    scheduleBlink();
  });
  button.addEventListener('focus', () => { hovered = true; showExpression('happy'); });
  button.addEventListener('blur', () => { hovered = false; showExpression('normal'); scheduleBlink(); });
  button.addEventListener('click', () => {
    showExpression('happy');
    button.setAttribute('aria-label', 'A personagem está feliz! Passe o mouse para interagir novamente');
    window.setTimeout(() => button.setAttribute('aria-label', 'Interagir com a personagem'), 1400);
  });
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) scheduleBlink();
  });
  scheduleBlink();
})();
