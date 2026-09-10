"use strict";
(() => {
  const normalize = value => (value || '').normalize('NFC').toLocaleLowerCase('th').trim();

  function createDiscovery(opts){
    const parent = document.querySelector(opts.parentSelector);
    const cards = Array.from(document.querySelectorAll(opts.cardSelector));
    const search = document.querySelector(opts.searchSelector);
    const clear = document.querySelector(opts.clearSelector);
    const filters = Array.from(document.querySelectorAll(opts.filterSelector));
    const count = document.querySelector(opts.countSelector);
    const more = document.querySelector(opts.moreSelector);
    if(!parent || !cards.length || parent.dataset.discoveryReady || !(search || filters.length || more)) return;
    parent.dataset.discoveryReady = 'true';
    const queryParam = opts.queryParam || 'q', categoryParam = opts.categoryParam || 'category';
    const motion = window.PondUI?.motion || matchMedia('(prefers-reduced-motion: reduce)');
    const text = new Map(cards.map(card => [card,normalize(card.dataset.searchText || card.textContent)]));
    const animations = new Map();
    let active = 'all', expanded = false, inputTimer = 0, visible = new Set();
    let empty = parent.querySelector('.discovery-empty');
    if(!empty){
      empty = document.createElement('div');
      empty.className = 'discovery-empty';
      empty.innerHTML = `<b>${opts.emptyTitle}</b><span>${opts.emptyHint}</span><button type="button">ล้างคำค้นและตัวกรอง</button>`;
      parent.appendChild(empty);
    }
    if(count){ count.setAttribute('aria-live','polite'); count.setAttribute('aria-atomic','true'); }
    function readURL(){
      const params = new URLSearchParams(location.search);
      active = params.get(categoryParam) || 'all';
      if(!filters.some(button => button.dataset[opts.filterDataset] === active)) active = 'all';
      if(search) search.value = params.get(queryParam) || '';
      expanded = false;
    }
    function saveURL(){
      if(location.protocol === 'file:') return;
      const params = new URLSearchParams(location.search);
      const query = search?.value.trim() || '';
      query ? params.set(queryParam,query) : params.delete(queryParam);
      active !== 'all' ? params.set(categoryParam,active) : params.delete(categoryParam);
      const next = `${location.pathname}${params.size ? '?' + params.toString() : ''}${location.hash}`;
      try { history.replaceState(history.state,'',next); } catch { /* Filtering still works without History API access. */ }
    }
    function apply(animate = true, save = true){
      clearTimeout(inputTimer);
      const q = normalize(search?.value);
      const matches = cards.filter(card => (active === 'all' || card.dataset[opts.categoryDataset] === active) && (!q || text.get(card).includes(q)));
      const filtering = active !== 'all' || Boolean(q);
      const shown = matches.slice(0,expanded || filtering ? matches.length : opts.defaultLimit);
      const nextVisible = new Set(shown);
      animations.forEach(animation => animation.cancel()); animations.clear();
      cards.forEach(card => {
        const hidden = !nextVisible.has(card);
        card.hidden = hidden;
        card.classList.toggle('ux-hidden',hidden);
      });
      if(animate && !motion.matches){
        shown.filter(card => !visible.has(card)).slice(0,12).forEach((card,index) => {
          if(typeof card.animate !== 'function') return;
          const animation = card.animate([{opacity:0.4,transform:'translateY(6px)'},{opacity:1,transform:'translateY(0)'}],{duration:200,delay:Math.min(index * 20,100),easing:'cubic-bezier(.2,.7,.2,1)'});
          animations.set(card,animation);
          animation.onfinish = () => animations.delete(card);
        });
      }
      visible = nextVisible;
      empty.hidden = matches.length > 0;
      empty.classList.toggle('ux-hidden',empty.hidden);
      if(clear) clear.hidden = !search?.value;
      filters.forEach(button => {
        const selected = button.dataset[opts.filterDataset] === active;
        button.classList.toggle('active',selected);
        button.setAttribute('aria-pressed',String(selected));
      });
      if(count) count.textContent = `${matches.length} ${opts.unit}`;
      if(more){
        const hideMore = filtering || matches.length <= opts.defaultLimit;
        const wrap = more.closest('.show-more-wrap') || more;
        wrap.hidden = hideMore;
        wrap.classList.toggle('is-hidden',hideMore);
        more.setAttribute('aria-expanded',String(expanded || filtering));
        const label = more.querySelector('span'), badge = more.querySelector('b');
        if(label) label.textContent = expanded ? opts.collapseText : opts.moreText;
        if(badge) badge.textContent = expanded ? '↑' : `+${Math.max(0,matches.length - opts.defaultLimit)}`;
      }
      if(save) saveURL();
      document.dispatchEvent(new Event('pond:content-change'));
    }
    filters.forEach(button => button.addEventListener('click',() => {
      active = button.dataset[opts.filterDataset] || 'all'; expanded = false; apply();
    }));
    search?.addEventListener('input',event => {
      clearTimeout(inputTimer);
      if(clear) clear.hidden = !search.value;
      if(event.isComposing) return;
      inputTimer = setTimeout(() => {expanded = false; apply();},100);
    });
    search?.addEventListener('compositionend',() => {expanded = false; apply();});
    clear?.addEventListener('click',() => {
      if(search){search.value = ''; search.focus();} expanded = false; apply();
    });
    empty.querySelector('button').addEventListener('click',() => {
      active = 'all'; expanded = false; if(search) search.value = ''; apply(); search?.focus();
    });
    more?.addEventListener('click',() => {
      expanded = !expanded; apply();
      if(!expanded) more.closest('section')?.scrollIntoView({behavior:motion.matches ? 'instant' : 'smooth',block:'start'});
    });
    if(search) document.addEventListener('keydown',event => {
      const focus = document.activeElement;
      const typing = /input|textarea|select/i.test(focus?.tagName || '') || focus?.isContentEditable;
      if(event.key === '/' && !typing && !event.ctrlKey && !event.metaKey && !event.altKey){event.preventDefault(); search.focus();}
      if(event.key === 'Escape' && focus === search && search.value){event.preventDefault(); search.value = ''; expanded = false; apply();}
    });
    window.addEventListener('popstate',() => {readURL(); apply(false,false);});
    motion.addEventListener('change',() => { if(motion.matches){animations.forEach(animation => animation.cancel()); animations.clear();} });
    readURL(); apply(false,false);
  }

  createDiscovery({
    cardSelector:"#courses .course-card",
    parentSelector:"#courses .course-grid",
    searchSelector:"#courseSearch",
    clearSelector:"#courseSearchClear",
    filterSelector:"#courseFilters [data-course-filter]",
    countSelector:"#courseResultCount",
    moreSelector:"#courseShowMore",
    categoryDataset:"courseCategory",
    filterDataset:"courseFilter",
    defaultLimit:6,
    unit:"คอร์ส",
    emptyTitle:"ไม่พบคอร์สที่ตรงกับคำค้น",
    emptyHint:"ลองใช้คำสั้นลงหรือเลือกหมวด “ทั้งหมด”",
    moreText:"ดูคอร์สเพิ่มเติม",
    collapseText:"ย่อรายการคอร์ส",
    queryParam:"q",
    categoryParam:"category"
  });

  createDiscovery({
    cardSelector:"#knowledge .blog-card",
    parentSelector:"#knowledge .blog-grid",
    searchSelector:"#articleSearch",
    clearSelector:"#articleSearchClear",
    filterSelector:"#articleFilters [data-article-filter]",
    countSelector:"#articleResultCount",
    moreSelector:"#articleShowMore",
    categoryDataset:"articleCategory",
    filterDataset:"articleFilter",
    defaultLimit:9,
    unit:"บทความ",
    emptyTitle:"ไม่พบบทความที่ตรงกับคำค้น",
    emptyHint:"ลองใช้คำสั้นลงหรือเลือกหมวด “ทั้งหมด”",
    moreText:"ดูบทความเพิ่มเติม",
    collapseText:"ย่อรายการบทความ",
    queryParam:"q",
    categoryParam:"category"
  });

})();
