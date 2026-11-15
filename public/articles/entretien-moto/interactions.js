function hidePopup(id){document.getElementById(id)?.classList.remove('open')}function showPopup(id){document.querySelectorAll('.popup.open').forEach(x=>x.classList.remove('open'));document.getElementById(id)?.classList.add('open')}document.addEventListener('keydown',e=>{if(e.key==='Escape')document.querySelectorAll('.popup.open').forEach(x=>x.classList.remove('open'))});document.addEventListener('click',e=>{if(!e.target.closest('.hotspot,.popup'))document.querySelectorAll('.popup.open').forEach(x=>x.classList.remove('open'))})

function techIndex(el){
 const cards=[...el.children]; if(!cards.length)return 0;
 let best=0,dist=Infinity;
 cards.forEach((card,i)=>{const d=Math.abs(card.offsetLeft-cards[0].offsetLeft-el.scrollLeft);if(d<dist){dist=d;best=i}});
 return best;
}
function updateTech(n){
 const el=document.getElementById('tech-carousel-'+n);if(!el)return;
 const cards=[...el.children], index=techIndex(el);
 const count=document.getElementById('tech-count-'+n);
 if(count)count.textContent=(index+1)+' / '+cards.length;
 const nav=el.previousElementSibling;
 if(nav){const btns=nav.querySelectorAll('button');if(btns.length===2){btns[0].disabled=index===0;btns[1].disabled=index===cards.length-1}}
}
function moveTech(n,delta){
 const el=document.getElementById('tech-carousel-'+n);if(!el)return;
 const cards=[...el.children];if(!cards.length)return;
 const index=Math.max(0,Math.min(cards.length-1,techIndex(el)+delta));
 el.scrollTo({left:cards[index].offsetLeft-cards[0].offsetLeft,behavior:'smooth'});
 setTimeout(()=>updateTech(n),450);
}
document.querySelectorAll('.technical-grid[id^="tech-carousel-"]').forEach(el=>{
 const n=Number(el.id.split('-').pop());let pending=false;
 el.addEventListener('scroll',()=>{if(!pending){pending=true;requestAnimationFrame(()=>{updateTech(n);pending=false})}},{passive:true});
 window.addEventListener('resize',()=>updateTech(n));updateTech(n);
});


// Les cartes de matériel sont affichées sans navigation JS.
// Aucun bouton ni compteur n'est requis dans les sections accessory-details.



document.querySelectorAll('.lm-sommaire a[href^="#controle-"]').forEach(function(a){
 a.addEventListener('click',function(e){
  const target=document.querySelector(a.getAttribute('href'));
  if(!target)return;
  e.preventDefault();
  target.open=true;
  target.scrollIntoView({behavior:'smooth',block:'start'});
  history.replaceState(null,'',a.getAttribute('href'));
 });
});

/* Menus materiel du mobile valide */

(function () {
  document.querySelectorAll('.lm-mobile-reference details.accessory-details').forEach(menu => {
    const track = menu.querySelector('ul.accessory-list');
    const cards = [...track.querySelectorAll(':scope > li')];
    const buttons = [...menu.querySelectorAll('.accessory-nav button')];
    const counter = menu.querySelector('.accessory-counter');
    if (!cards.length) return;
    const visible = () => window.matchMedia('(min-width:700px)').matches ? 2 : 1;
    const current = () => {
      let best = 0, distance = Infinity;
      cards.forEach((card, i) => {
        const d = Math.abs(card.offsetLeft - cards[0].offsetLeft - track.scrollLeft);
        if (d < distance) { best = i; distance = d; }
      });
      return best;
    };
    const update = () => {
      const i = current(), total = Math.max(1, cards.length - visible() + 1);
      counter.textContent = `${Math.min(i+1,total)} / ${total}`;
      buttons[0].disabled = i === 0;
      buttons[1].disabled = i >= cards.length - visible();
    };
    buttons.forEach(button => button.addEventListener('click', () => {
      const next = Math.max(0, Math.min(cards.length-visible(), current()+Number(button.dataset.direction)));
      track.scrollTo({left:cards[next].offsetLeft-cards[0].offsetLeft, behavior:'smooth'});
    }));
    track.addEventListener('scroll', () => requestAnimationFrame(update), {passive:true});
    menu.addEventListener('toggle', update);
    window.addEventListener('resize', update);
    update();
  });
})();



/* CTA modal mobile : portail au niveau document.body.
   Aucun element de l'article ne peut recouvrir la fenetre.
   Un tap ferme la fenetre; un glissement ne la ferme pas. */
(function(){
  const media=window.matchMedia('(max-width:700px)');
  let root=null, backdrop=null, slot=null, current=null, anchor=null, oldOverflow='', oldTouchAction='';
  let touchStart=null, moved=false;
  const originalShow=window.showPopup || showPopup;
  const originalHide=window.hidePopup || hidePopup;
  function ensureRoot(){
    if(root)return;
    root=document.createElement('div');root.id='lm-cta-modal-portal';
    root.className='lm-real-site-article';
    root.innerHTML='<div class="lm-cta-backdrop"></div><div class="lm-native-article lm-cta-layer"><div class="lm-mobile-reference lm-cta-wrapper"><div class="section"><div class="visual lm-cta-host"></div></div></div></div>';
    document.body.appendChild(root);
    backdrop=root.querySelector('.lm-cta-backdrop');
    slot=root.querySelector('.lm-cta-host');
    root.addEventListener('touchstart',e=>{touchStart=e.touches.length===1?{x:e.touches[0].clientX,y:e.touches[0].clientY}:null;moved=false},{passive:true});
    root.addEventListener('touchmove',e=>{if(touchStart&&e.touches.length){if(Math.hypot(e.touches[0].clientX-touchStart.x,e.touches[0].clientY-touchStart.y)>9)moved=true;}},{passive:true});
    root.addEventListener('click',e=>{
      if(!current)return;
      if(moved){moved=false;return;}
      e.preventDefault();e.stopPropagation();close();
    },true);
  }
  function close(){
    if(!current)return;
    current.classList.remove('open');
    if(anchor?.parentNode)anchor.parentNode.insertBefore(current,anchor);
    anchor?.remove();anchor=null;current=null;
    root.classList.remove('lm-cta-active');
    document.documentElement.style.overflow=oldOverflow;
    document.body.style.touchAction=oldTouchAction;
  }
  window.showPopup=function(id){
    if(!media.matches){close();return originalShow(id);}
    const popup=document.getElementById(id);
    if(!popup)return;
    close();
    document.querySelectorAll('.popup.open').forEach(el=>el.classList.remove('open'));
    ensureRoot();
    anchor=document.createComment('CTA modal original position');
    popup.parentNode.insertBefore(anchor,popup);
    current=popup;
    slot.appendChild(popup);
    oldOverflow=document.documentElement.style.overflow;
    oldTouchAction=document.body.style.touchAction;
    document.documentElement.style.overflow='hidden';
    document.body.style.touchAction='pan-y';
    root.classList.add('lm-cta-active');
    popup.classList.add('open');
  };
  window.hidePopup=function(id){
    if(current&&(!id||current.id===id)){close();return;}
    originalHide(id);
  };
  document.addEventListener('keydown',e=>{if(e.key==='Escape')close()},true);
  window.addEventListener('pagehide',close);
})();
