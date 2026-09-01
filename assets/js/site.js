"use strict";
// ambient network node animation — reusable, with mouse-reactive burst
  function initNetwork(canvasId, hostEl, opts){
    opts = opts || {};
    const canvas = document.getElementById(canvasId);
    if(!canvas || !hostEl) return;
    const ctx = canvas.getContext('2d');
    const glow = opts.glowId ? document.getElementById(opts.glowId) : null;
    let w, h, nodes;
    let glowX = 0, glowY = 0; // smoothed (lagging) glow position
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const mouse = { x: null, y: null, active: false };
    const density = opts.density || 42000;
    const maxNodes = opts.maxNodes || 60;

    function resize(){
      w = canvas.width = canvas.offsetWidth * devicePixelRatio;
      h = canvas.height = canvas.offsetHeight * devicePixelRatio;
    }
    function initNodes(){
      const count = Math.min(maxNodes, Math.floor((w*h) / density));
      nodes = Array.from({length: count}, () => ({
        x: Math.random()*w, y: Math.random()*h,
        vx: (Math.random()-0.5)*0.25, vy: (Math.random()-0.5)*0.25
      }));
      // designate a slow-drifting "core" hub node near center — always connected
      // to its nearest neighbors, giving a neural-network / infrastructure-hub look
      if(opts.coreNode && nodes.length){
        nodes[0].x = w/2; nodes[0].y = h/2;
        nodes[0].vx = (Math.random()-0.5)*0.06;
        nodes[0].vy = (Math.random()-0.5)*0.06;
        nodes[0].isCore = true;
      }
    }
    function step(){
      ctx.clearRect(0,0,w,h);
      if(!reduced){
        for(const n of nodes){
          n.x += n.vx; n.y += n.vy;
          if(n.x<0||n.x>w) n.vx*=-1;
          if(n.y<0||n.y>h) n.vy*=-1;
        }
      }
      // ambient node-to-node links
      for(let i=0;i<nodes.length;i++){
        for(let j=i+1;j<nodes.length;j++){
          const a=nodes[i], b=nodes[j];
          const dx=a.x-b.x, dy=a.y-b.y;
          const dist=Math.sqrt(dx*dx+dy*dy);
          const maxDist = 170*devicePixelRatio;
          if(dist < maxDist){
            ctx.strokeStyle = `rgba(72,139,255,${(1-dist/maxDist)*0.22})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y);
            ctx.stroke();
          }
        }
      }
      // core hub node: permanent spokes to nearby nodes + a slow pulsing glow,
      // giving a neural-network / infrastructure "core" look (not proximity-limited)
      if(opts.coreNode && nodes[0] && nodes[0].isCore){
        const core = nodes[0];
        const reach = 260 * devicePixelRatio;
        for(let k=1;k<nodes.length;k++){
          const n = nodes[k];
          const dx=n.x-core.x, dy=n.y-core.y;
          const dist=Math.sqrt(dx*dx+dy*dy);
          if(dist < reach){
            ctx.strokeStyle = `rgba(110,170,255,${(1-dist/reach)*0.45})`;
            ctx.lineWidth = 1.1;
            ctx.beginPath();
            ctx.moveTo(core.x,core.y); ctx.lineTo(n.x,n.y);
            ctx.stroke();
          }
        }
        const pulse = 0.55 + Math.sin(performance.now()/900) * 0.25;
        const coreGrad = ctx.createRadialGradient(core.x,core.y,0, core.x,core.y, 26*devicePixelRatio);
        coreGrad.addColorStop(0, `rgba(120,180,255,${pulse})`);
        coreGrad.addColorStop(1, 'rgba(120,180,255,0)');
        ctx.fillStyle = coreGrad;
        ctx.beginPath();
        ctx.arc(core.x, core.y, 26*devicePixelRatio, 0, Math.PI*2);
        ctx.fill();
        ctx.fillStyle = '#dce9ff';
        ctx.beginPath();
        ctx.arc(core.x, core.y, 3.4*devicePixelRatio, 0, Math.PI*2);
        ctx.fill();
      }
      // mouse-reactive burst: cursor acts as a bright node pulling glowing lines to nearby nodes
      if(mouse.active && mouse.x !== null){
        const mx = mouse.x * devicePixelRatio, my = mouse.y * devicePixelRatio;
        const reach = 230 * devicePixelRatio;
        for(const n of nodes){
          const dx = n.x-mx, dy = n.y-my;
          const dist = Math.sqrt(dx*dx+dy*dy);
          if(dist < reach){
            const t = 1 - dist/reach;
            ctx.strokeStyle = `rgba(72,139,255,${t*0.75})`;
            ctx.lineWidth = 1.4;
            ctx.beginPath();
            ctx.moveTo(mx,my); ctx.lineTo(n.x,n.y);
            ctx.stroke();
            ctx.fillStyle = `rgba(87,137,220,${t})`;
            ctx.beginPath();
            ctx.arc(n.x, n.y, 2.2*devicePixelRatio, 0, Math.PI*2);
            ctx.fill();
          }
        }
        const grad = ctx.createRadialGradient(mx,my,0, mx,my, 14*devicePixelRatio);
        grad.addColorStop(0, 'rgba(91,157,255,0.55)');
        grad.addColorStop(1, 'rgba(91,157,255,0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(mx,my, 14*devicePixelRatio, 0, Math.PI*2);
        ctx.fill();
        ctx.fillStyle = '#0f2f76';
        ctx.beginPath();
        ctx.arc(mx,my, 2.6*devicePixelRatio, 0, Math.PI*2);
        ctx.fill();
      }
      for(const n of nodes){
        ctx.fillStyle = 'rgba(87,137,220,0.38)';
        ctx.beginPath();
        ctx.arc(n.x, n.y, 1.6*devicePixelRatio, 0, Math.PI*2);
        ctx.fill();
      }
      // soft ambient glow that trails the cursor with a gentle lag (mix of network + glow-follow)
      if(glow){
        if(mouse.active && mouse.x !== null){
          glowX += (mouse.x - glowX) * 0.09;
          glowY += (mouse.y - glowY) * 0.09;
          glow.style.opacity = '1';
          glow.style.transform = `translate(${glowX}px, ${glowY}px) translate(-50%,-50%)`;
        } else {
          glow.style.opacity = '0';
        }
      }
      requestAnimationFrame(step);
    }
    window.addEventListener('resize', () => { resize(); initNodes(); });
    hostEl.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    });
    hostEl.addEventListener('mouseleave', () => { mouse.active = false; });
    hostEl.addEventListener('touchmove', (e) => {
      const rect = canvas.getBoundingClientRect();
      const t = e.touches[0];
      mouse.x = t.clientX - rect.left;
      mouse.y = t.clientY - rect.top;
      mouse.active = true;
    }, {passive:true});
    hostEl.addEventListener('touchend', () => { mouse.active = false; });
    resize(); initNodes(); step();
  }

  initNetwork('netCanvas', document.querySelector('.hero'), {glowId:'glowHero', coreNode:true});
  initNetwork('netCanvasProjects', document.getElementById('work'), {density:58000, maxNodes:40, glowId:'glowProjects', coreNode:true});
  initNetwork('netCanvasReviews', document.getElementById('reviews'), {density:58000, maxNodes:40, glowId:'glowReviews', coreNode:true});

  // ---- animated count-up stats (runs once when the stat bar scrolls into view) ----
  // ---- premium count-up numbers ----
  function animateNumber(el, target, decimals = 0, suffix = ''){
    if(el.dataset.counted === '1') return;
    el.dataset.counted = '1';
    const duration = 1500;
    const start = performance.now();
    function tick(now){
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = (target * eased).toFixed(decimals) + suffix;
      if(progress < 1) requestAnimationFrame(tick);
      else el.textContent = target.toFixed(decimals) + suffix;
    }
    requestAnimationFrame(tick);
  }

  const countTargets = document.querySelectorAll('.stats .num, .project-count-badge .pcb-num');
  if(countTargets.length && 'IntersectionObserver' in window){
    const countIO = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if(!entry.isIntersecting) return;
        const el = entry.target;
        let target, decimals = 0, suffix = '';
        if(el.classList.contains('num')){
          target = parseFloat(el.dataset.target || '0');
          decimals = parseInt(el.dataset.decimals || '0', 10);
          suffix = el.dataset.suffix || '';
        }else{
          const raw = el.textContent.trim();
          const match = raw.match(/([0-9]+(?:\.[0-9]+)?)(.*)/);
          if(!match) return;
          target = parseFloat(match[1]);
          suffix = match[2] || '';
        }
        animateNumber(el, target, decimals, suffix);
        countIO.unobserve(el);
      });
    }, {threshold: 0.45});
    countTargets.forEach(el => countIO.observe(el));
  }else{
    countTargets.forEach(el => {
      if(el.classList.contains('num')){
        el.textContent = (parseFloat(el.dataset.target || '0')).toFixed(parseInt(el.dataset.decimals || '0',10)) + (el.dataset.suffix || '');
      }
    });
  }

  // ---- floating live-chat widget ----
  (function(){
    const toggle = document.getElementById('chatToggle');
    const panel = document.getElementById('chatPanel');
    const panelClose = document.getElementById('chatPanelClose');
    const teaser = document.getElementById('chatTeaser');
    const teaserClose = document.getElementById('chatTeaserClose');
    if(!toggle || !panel) return;

    function hideTeaser(){ teaser && teaser.classList.remove('show'); }
    function openPanel(){ panel.classList.add('open'); hideTeaser(); }
    function closePanel(){ panel.classList.remove('open'); }

    toggle.addEventListener('click', () => {
      panel.classList.contains('open') ? closePanel() : openPanel();
    });
    panelClose && panelClose.addEventListener('click', closePanel);
    teaserClose && teaserClose.addEventListener('click', (e) => { e.stopPropagation(); hideTeaser(); });
    teaser && teaser.addEventListener('click', openPanel);
    document.addEventListener('click', (e) => {
      if(panel.classList.contains('open') && !panel.contains(e.target) && !toggle.contains(e.target)){
        closePanel();
      }
    });

    // one-time greeting bubble a few seconds after page load
    setTimeout(() => { if(!panel.classList.contains('open')) teaser && teaser.classList.add('show'); }, 3500);
    setTimeout(hideTeaser, 13000);
  })();

(function(){
    // Project carousel is handled by the UX refresh script below.

    // Lightbox & Smooth scroll
    const box = document.getElementById('lightbox');
    const img = document.getElementById('lightboxImg');
    const close = document.getElementById('lightboxClose');

    // Use event delegation to support cloned elements
    document.body.addEventListener('click', e => {
      const btn = e.target.closest('[data-lightbox]');
      if(btn) {
        img.src = btn.dataset.lightbox;
        box.classList.add('open');
        document.body.style.overflow = 'hidden';
      }
    });

    function hide(){
      box.classList.remove('open');
      document.body.style.overflow = '';
      img.src = '';
    }
    close.addEventListener('click', hide);
    box.addEventListener('click', e => { if(e.target === box) hide(); });
    document.addEventListener('keydown', e => { if(e.key === 'Escape') hide(); });

    document.querySelectorAll('[data-scroll-contact]').forEach(el => {
      el.addEventListener('click', () => {
        document.getElementById('contact')?.scrollIntoView({behavior:'smooth'});
      });
    });
  })();

(function(){
  // Project filters
  const filterBtns=[...document.querySelectorAll('.filter-btn')];
  const projects=[...document.querySelectorAll('#projectTrack .project-card')];
  filterBtns.forEach(btn=>btn.addEventListener('click',()=>{
    filterBtns.forEach(b=>b.classList.remove('active')); btn.classList.add('active');
    const f=btn.dataset.filter;
    projects.forEach(card=>card.classList.toggle('is-hidden',f!=='all' && card.dataset.cat!==f));
  }));

  // Learning path tabs
  const tabs=[...document.querySelectorAll('.learning-tab')]; const panels=[...document.querySelectorAll('.learning-panel')];
  tabs.forEach(tab=>tab.addEventListener('click',()=>{
    tabs.forEach(t=>t.classList.remove('active')); tab.classList.add('active');
    panels.forEach(p=>p.classList.toggle('active',p.dataset.panel===tab.dataset.path));
  }));
})();

/* =========================================================
   PREMIUM MOTION — cursor light + scroll reveal
   ========================================================= */
(function(){
  const glow = document.querySelector('.cursor-glow');
  let mx = innerWidth/2, my = innerHeight/2, gx = mx, gy = my;

  addEventListener('pointermove', e => {
    mx = e.clientX; my = e.clientY;
    if(glow) glow.style.opacity = '1';
  }, {passive:true});

  addEventListener('pointerleave', () => {
    if(glow) glow.style.opacity = '0';
  });

  function animateGlow(){
    gx += (mx-gx)*0.075;
    gy += (my-gy)*0.075;
    if(glow) glow.style.left = gx+'px', glow.style.top = gy+'px';
    requestAnimationFrame(animateGlow);
  }
  animateGlow();

  const reveals = document.querySelectorAll('.reveal');
  if('IntersectionObserver' in window){
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if(entry.isIntersecting){
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, {threshold:.10, rootMargin:'0px 0px -40px 0px'});
    reveals.forEach(el => io.observe(el));
  }else{
    reveals.forEach(el => el.classList.add('is-visible'));
  }

  /* Add a tiny 3D response to cards without changing layout. */
  const cards = document.querySelectorAll('.course-card,.project-card,.business-card,.case-card,.intent-card');
  cards.forEach(card => {
    card.addEventListener('pointermove', e => {
      if(matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      const r = card.getBoundingClientRect();
      const x = (e.clientX-r.left)/r.width-.5;
      const y = (e.clientY-r.top)/r.height-.5;
      card.style.transform = `perspective(900px) rotateX(${(-y*2.2).toFixed(2)}deg) rotateY(${(x*2.8).toFixed(2)}deg) translateY(-4px)`;
    });
    card.addEventListener('pointerleave', () => {
      card.style.transform='';
    });
  });
})();

(function(){
  const vp=document.querySelector('.review-viewport');
  const track=document.querySelector('.review-viewport .rgrid');
  if(!vp||!track) return;
  vp.addEventListener('focusin',()=>track.style.animationPlayState='paused');
  vp.addEventListener('focusout',()=>track.style.animationPlayState='running');
})();

(function(){
  "use strict";

  // Lead form -> Email
  // Back to top
  const topBtn = document.createElement("button");
  topBtn.className = "back-top";
  topBtn.type = "button";
  topBtn.setAttribute("aria-label","กลับขึ้นด้านบน");
  topBtn.textContent = "↑";
  document.body.appendChild(topBtn);
  window.addEventListener("scroll", function(){
    topBtn.classList.toggle("show", window.scrollY > 650);
  }, {passive:true});
  topBtn.addEventListener("click", function(){
    window.scrollTo({top:0,behavior:"smooth"});
  });

  // Project filtering — only applies when cards carry data-category.
  const buttons = document.querySelectorAll(".filter-btn");
  const cards = document.querySelectorAll("[data-category]");
  if(buttons.length && cards.length){
    buttons.forEach(btn => btn.addEventListener("click", () => {
      buttons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const filter = btn.dataset.filter;
      cards.forEach(card => {
        card.classList.toggle("is-hidden", filter !== "all" && card.dataset.category !== filter);
      });
    }));
  }

  // Prevent pointer-follow transforms from creating shaking on touch devices.
  if (window.matchMedia("(pointer:coarse)").matches) {
    document.documentElement.classList.add("coarse-pointer");
  }
})();

(function(){
  "use strict";

  const normalize = s => (s || "").toLocaleLowerCase("th").trim();

  function createDiscovery(opts){
    const cards = Array.from(document.querySelectorAll(opts.cardSelector));
    const search = document.querySelector(opts.searchSelector);
    const clear = document.querySelector(opts.clearSelector);
    const filters = Array.from(document.querySelectorAll(opts.filterSelector));
    const count = document.querySelector(opts.countSelector);
    const more = document.querySelector(opts.moreSelector);
    const parent = document.querySelector(opts.parentSelector);
    if(!cards.length || !parent) return;

    let active = "all";
    let expanded = false;
    const defaultLimit = opts.defaultLimit;

    const empty = document.createElement("div");
    empty.className = "discovery-empty ux-hidden";
    empty.innerHTML = "<b>ไม่พบรายการที่ตรงกับคำค้น</b><span>ลองเปลี่ยนคำค้นหรือเลือกหมวด “ทั้งหมด”</span>";
    parent.appendChild(empty);

    function apply(){
      const q = normalize(search ? search.value : "");
      const matches = cards.filter(card => {
        const category = card.dataset[opts.categoryDataset] || "other";
        const text = normalize(card.dataset.searchText || card.innerText);
        return (active === "all" || category === active) && (!q || text.includes(q));
      });

      const filtering = active !== "all" || !!q;
      const visibleLimit = (expanded || filtering) ? Infinity : defaultLimit;

      cards.forEach(card => card.classList.add("ux-hidden"));
      matches.forEach((card, index) => {
        if(index < visibleLimit) card.classList.remove("ux-hidden");
      });

      empty.classList.toggle("ux-hidden", matches.length !== 0);

      if(count){
        count.textContent = matches.length + " " + opts.unit;
      }

      if(more){
        const wrap = more.closest(".show-more-wrap");
        const remaining = Math.max(0, matches.length - defaultLimit);
        if(filtering || matches.length <= defaultLimit){
          if(wrap) wrap.classList.add("is-hidden");
        }else{
          if(wrap) wrap.classList.remove("is-hidden");
          const label = more.querySelector("span");
          const badge = more.querySelector("b");
          if(label) label.textContent = expanded ? opts.collapseText : opts.moreText;
          if(badge) badge.textContent = expanded ? "↑" : "+" + remaining;
        }
      }
    }

    filters.forEach(btn => btn.addEventListener("click", () => {
      filters.forEach(x => x.classList.remove("active"));
      btn.classList.add("active");
      active = btn.dataset[opts.filterDataset] || "all";
      expanded = false;
      apply();
    }));

    if(search){
      search.addEventListener("input", () => {
        expanded = false;
        apply();
      });
    }
    if(clear && search){
      clear.addEventListener("click", () => {
        search.value = "";
        search.focus();
        expanded = false;
        apply();
      });
    }
    if(more){
      more.addEventListener("click", () => {
        expanded = !expanded;
        apply();
        if(!expanded){
          const section = more.closest("section");
          if(section) section.scrollIntoView({behavior:"smooth", block:"start"});
        }
      });
    }
    apply();
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
    moreText:"ดูคอร์สเพิ่มเติม",
    collapseText:"ย่อรายการคอร์ส"
  });

  createDiscovery({
    cardSelector:"#work .project-card",
    parentSelector:"#projectTrack",
    searchSelector:"#projectSearch",
    clearSelector:"#projectSearchClear",
    filterSelector:"#projectFilters [data-project-filter]",
    countSelector:"#projectResultCount",
    moreSelector:"#projectShowMore",
    categoryDataset:"projectCategory",
    filterDataset:"projectFilter",
    defaultLimit:999,
    unit:"โปรเจกต์",
    moreText:"ดูโปรเจกต์เพิ่มเติม",
    collapseText:"ย่อรายการโปรเจกต์"
  });

  // Smooth internal navigation where supported.
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener("click", e => {
      const target = document.querySelector(a.getAttribute("href"));
      if(!target) return;
      e.preventDefault();
      target.scrollIntoView({behavior:"smooth", block:"start"});
      history.replaceState(null,"",a.getAttribute("href"));
    });
  });
})();

(function(){
  const scroller=document.querySelector('#work .project-marquee-wrap');
  const track=document.getElementById('projectTrack');
  const prev=document.getElementById('projectPrev');
  const next=document.getElementById('projectNext');
  if(!scroller||!track) return;

  const reduce=window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let paused=false, timer=null;

  function visibleCards(){
    return Array.from(track.querySelectorAll('.project-card')).filter(c=>!c.classList.contains('ux-hidden') && c.getAttribute('aria-hidden')!=='true');
  }
  function step(){
    const cards=visibleCards();
    if(!cards.length) return Math.min(scroller.clientWidth*.86,340);
    const card=cards[0];
    const gap=parseFloat(getComputedStyle(track).gap)||18;
    return card.getBoundingClientRect().width+gap;
  }
  function atEnd(){ return scroller.scrollLeft+scroller.clientWidth>=scroller.scrollWidth-8; }
  function move(dir){
    if(dir>0 && atEnd()) scroller.scrollTo({left:0,behavior:'smooth'});
    else if(dir<0 && scroller.scrollLeft<=8) scroller.scrollTo({left:Math.max(0,scroller.scrollWidth-scroller.clientWidth),behavior:'smooth'});
    else scroller.scrollBy({left:dir*step(),behavior:'smooth'});
  }
  function start(){
    if(reduce||timer) return;
    timer=setInterval(()=>{ if(!paused && document.visibilityState==='visible') move(1); },3200);
  }
  function stop(){ if(timer){clearInterval(timer);timer=null;} }
  prev&&prev.addEventListener('click',()=>{move(-1);});
  next&&next.addEventListener('click',()=>{move(1);});
  scroller.addEventListener('mouseenter',()=>paused=true);
  scroller.addEventListener('mouseleave',()=>paused=false);
  scroller.addEventListener('focusin',()=>paused=true);
  scroller.addEventListener('focusout',()=>paused=false);
  scroller.addEventListener('pointerdown',()=>paused=true,{passive:true});
  window.addEventListener('pointerup',()=>{paused=false;},{passive:true});

  // Reset carousel after search/filter changes.
  document.querySelectorAll('#projectFilters [data-project-filter]').forEach(b=>b.addEventListener('click',()=>setTimeout(()=>scroller.scrollTo({left:0,behavior:'smooth'}),40)));
  const search=document.getElementById('projectSearch');
  search&&search.addEventListener('input',()=>setTimeout(()=>scroller.scrollTo({left:0,behavior:'auto'}),20));

  document.addEventListener('visibilitychange',()=>{ if(document.visibilityState==='hidden') stop(); else start(); });
  start();
})();
