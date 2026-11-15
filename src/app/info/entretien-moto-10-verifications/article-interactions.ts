/**
 * Interactions client du guide entretien.
 * Intégrées au bundle Next.js : aucun fichier /public à charger en production.
 * Le HTML éditorial, les visuels et les CSS validés restent inchangés.
 */

function carouselIndex(track: HTMLElement): number {
  const cards = Array.from(track.children) as HTMLElement[];
  if (!cards.length) return 0;
  let nearest = 0;
  let distance = Infinity;
  cards.forEach((card, index) => {
    const gap = Math.abs(card.offsetLeft - cards[0].offsetLeft - track.scrollLeft);
    if (gap < distance) {
      distance = gap;
      nearest = index;
    }
  });
  return nearest;
}

function updateCarousel(track: HTMLElement): void {
  const cards = Array.from(track.children) as HTMLElement[];
  if (!cards.length) return;
  const index = carouselIndex(track);
  const navigation = track.previousElementSibling;
  const count = navigation?.querySelector<HTMLElement>('.technical-counter');
  if (count) count.textContent = `${index + 1} / ${cards.length}`;
  const arrows = navigation?.querySelectorAll<HTMLButtonElement>('.technical-arrow');
  if (arrows?.length === 2) {
    arrows[0].disabled = index === 0;
    arrows[1].disabled = index === cards.length - 1;
  }
}

export function initializeArticleInteractions(articleRoot: HTMLElement): () => void {
  const events = new AbortController();
  const { signal } = events;
  const mobile = window.matchMedia('(max-width:700px)');
  let activePopup: HTMLElement | null = null;
  let placeholder: Comment | null = null;
  let portal: HTMLElement | null = null;
  let portalHost: HTMLElement | null = null;
  let previousOverflow = '';
  let previousTouchAction = '';
  let touchStart: { x: number; y: number } | null = null;
  let touchMoved = false;
  const pendingTimers = new Set<ReturnType<typeof setTimeout>>();

  const closePopup = () => {
    if (!activePopup) return;
    const wasMobileModal = placeholder !== null;
    activePopup.classList.remove('open');
    if (placeholder?.parentNode) placeholder.parentNode.insertBefore(activePopup, placeholder);
    placeholder?.remove();
    placeholder = null;
    activePopup = null;
    portal?.classList.remove('lm-cta-active');
    if (wasMobileModal) {
      document.documentElement.style.overflow = previousOverflow;
      document.body.style.touchAction = previousTouchAction;
    }
  };

  const ensurePortal = () => {
    if (portal) return;
    portal = document.createElement('div');
    portal.id = 'lm-cta-modal-portal';
    portal.className = 'lm-real-site-article';
    portal.innerHTML = '<div class="lm-cta-backdrop"></div><div class="lm-native-article lm-cta-layer"><div class="lm-mobile-reference lm-cta-wrapper"><div class="section"><div class="visual lm-cta-host"></div></div></div></div>';
    document.body.appendChild(portal);
    portalHost = portal.querySelector<HTMLElement>('.lm-cta-host');
    portal.addEventListener('touchstart', event => {
      touchStart = event.touches.length === 1
        ? { x: event.touches[0].clientX, y: event.touches[0].clientY }
        : null;
      touchMoved = false;
    }, { passive: true, signal });
    portal.addEventListener('touchmove', event => {
      if (!touchStart || !event.touches.length) return;
      if (Math.hypot(event.touches[0].clientX - touchStart.x, event.touches[0].clientY - touchStart.y) > 9) {
        touchMoved = true;
      }
    }, { passive: true, signal });
    portal.addEventListener('click', event => {
      if (!activePopup) return;
      if (touchMoved) {
        touchMoved = false;
        return;
      }
      event.preventDefault();
      event.stopPropagation();
      closePopup();
    }, { capture: true, signal });
  };

  const openPopup = (button: HTMLButtonElement) => {
    const handler = button.getAttribute('data-lm-popup-handler') ?? '';
    const id = button.getAttribute('aria-controls') ?? handler.match(/showPopup\(['"]([\w-]+)['"]\)/)?.[1];
    if (!id || !/^[\w-]+$/.test(id)) return;
    // Les versions desktop et mobile partagent certains IDs : toujours chercher
    // le visuel lié au bouton pressé, jamais document.getElementById(id).
    const popup = button.closest('.visual')?.querySelector<HTMLElement>(`.popup[id="${id}"]`);
    if (!popup) return;
    closePopup();
    articleRoot.querySelectorAll('.popup.open').forEach(element => element.classList.remove('open'));
    activePopup = popup;
    if (mobile.matches) {
      ensurePortal();
      if (!portalHost) return;
      placeholder = document.createComment('Emplacement original de la fenêtre CTA');
      popup.parentNode?.insertBefore(placeholder, popup);
      portalHost.appendChild(popup);
      previousOverflow = document.documentElement.style.overflow;
      previousTouchAction = document.body.style.touchAction;
      document.documentElement.style.overflow = 'hidden';
      document.body.style.touchAction = 'pan-y';
      portal?.classList.add('lm-cta-active');
    }
    popup.classList.add('open');
  };

  // Enlever les handlers inline qui appelaient un script 404, puis connecter
  // chaque repère à sa fenêtre, dans la bonne version de la page.
  articleRoot.querySelectorAll<HTMLButtonElement>('button.hotspot').forEach(button => {
    // React Strict Mode peut monter/démonter deux fois les effets : garder
    // le handler d'origine pour les CTA sans attribut aria-controls.
    if (button.hasAttribute('onclick')) {
      button.setAttribute('data-lm-popup-handler', button.getAttribute('onclick') ?? '');
    }
    button.removeAttribute('onclick');
    button.addEventListener('click', () => openPopup(button), { signal });
  });
  articleRoot.querySelectorAll<HTMLButtonElement>('.popup button.close').forEach(button => {
    button.removeAttribute('onclick');
    button.addEventListener('click', event => {
      event.stopPropagation();
      closePopup();
    }, { signal });
  });

  // Navigation de tous les carrousels, sans conflit entre IDs mobile/desktop.
  articleRoot.querySelectorAll<HTMLElement>('.technical-grid[id^="tech-carousel-"]').forEach(track => {
    const navigation = track.previousElementSibling;
    navigation?.querySelectorAll<HTMLButtonElement>('.technical-arrow').forEach((button, index) => {
      button.removeAttribute('onclick');
      button.addEventListener('click', () => {
        const cards = Array.from(track.children) as HTMLElement[];
        if (!cards.length) return;
        const nextIndex = Math.max(0, Math.min(cards.length - 1, carouselIndex(track) + (index === 0 ? -1 : 1)));
        track.scrollTo({ left: cards[nextIndex].offsetLeft - cards[0].offsetLeft, behavior: 'smooth' });
        const timer = setTimeout(() => {
          pendingTimers.delete(timer);
          updateCarousel(track);
        }, 450);
        pendingTimers.add(timer);
      }, { signal });
    });
    let pending = false;
    track.addEventListener('scroll', () => {
      if (pending) return;
      pending = true;
      requestAnimationFrame(() => {
        if (!signal.aborted) updateCarousel(track);
        pending = false;
      });
    }, { passive: true, signal });
    window.addEventListener('resize', () => updateCarousel(track), { signal });
    updateCarousel(track);
  });

  // Sommaire accordéon : ouvrir la rubrique avant de défiler jusqu'à elle.
  articleRoot.querySelectorAll<HTMLAnchorElement>('.lm-sommaire a[href^="#controle-"]').forEach(link => {
    link.addEventListener('click', event => {
      const href = link.getAttribute('href');
      if (!href || !/^#controle-\d+$/.test(href)) return;
      const target = articleRoot.querySelector<HTMLDetailsElement>(href);
      if (!target) return;
      event.preventDefault();
      target.open = true;
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.replaceState(null, '', href);
    }, { signal });
  });

  // Carrousels « Matériel utile » sur mobile, inchangés visuellement.
  articleRoot.querySelectorAll<HTMLDetailsElement>('.lm-mobile-reference details.accessory-details').forEach(menu => {
    const track = menu.querySelector<HTMLElement>('ul.accessory-list');
    const buttons = Array.from(menu.querySelectorAll<HTMLButtonElement>('.accessory-nav button'));
    const counter = menu.querySelector<HTMLElement>('.accessory-counter');
    if (!track || buttons.length !== 2 || !counter || !track.children.length) return;
    const cards = Array.from(track.children) as HTMLElement[];
    const visible = () => window.matchMedia('(min-width:700px)').matches ? 2 : 1;
    const update = () => {
      const current = carouselIndex(track);
      const total = Math.max(1, cards.length - visible() + 1);
      counter.textContent = `${Math.min(current + 1, total)} / ${total}`;
      buttons[0].disabled = current === 0;
      buttons[1].disabled = current >= cards.length - visible();
    };
    buttons.forEach(button => button.addEventListener('click', () => {
      const current = carouselIndex(track);
      const delta = Number(button.dataset.direction);
      const next = Math.max(0, Math.min(cards.length - visible(), current + (Number.isFinite(delta) ? delta : 0)));
      track.scrollTo({ left: cards[next].offsetLeft - cards[0].offsetLeft, behavior: 'smooth' });
      const timer = setTimeout(() => {
        pendingTimers.delete(timer);
        update();
      }, 450);
      pendingTimers.add(timer);
    }, { signal }));
    track.addEventListener('scroll', () => requestAnimationFrame(() => {
      if (!signal.aborted) update();
    }), { passive: true, signal });
    menu.addEventListener('toggle', update, { signal });
    window.addEventListener('resize', update, { signal });
    update();
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closePopup();
  }, { signal });
  document.addEventListener('click', event => {
    const target = event.target;
    if (!activePopup || !(target instanceof Element)) return;
    if (target.closest('.hotspot,.popup,#lm-cta-modal-portal')) return;
    closePopup();
  }, { signal });
  window.addEventListener('pagehide', closePopup, { signal });
  window.addEventListener('resize', () => {
    if (activePopup && !mobile.matches) closePopup();
  }, { signal });

  return () => {
    closePopup();
    events.abort();
    pendingTimers.forEach(timer => clearTimeout(timer));
    portal?.remove();
  };
}
