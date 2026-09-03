"use strict";
// ambient network node animation — reusable, with mouse-reactive burst
  function initNetwork(canvasId, hostEl, opts){
    opts = opts || {};
    const canvas = document.getElementById(canvasId);
    if(!canvas || !hostEl) return;
    const ctx = canvas.getContext('2d', {alpha:true, desynchronized:true});
    let w, h, nodes;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const smallScreen = window.matchMedia('(max-width: 720px)').matches;
    const animate = !reduced && !smallScreen;
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.35);
    let inViewport = true;
    let frameId = 0;
    let lastFrame = 0;
    const mouse = { x: null, y: null, active: false };
    const density = opts.density || 24000;
    const maxNodes = opts.maxNodes || 82;
    const interactive = Boolean(opts.interactive);

    function resize(){
      w = canvas.width = Math.round(canvas.offsetWidth * pixelRatio);
      h = canvas.height = Math.round(canvas.offsetHeight * pixelRatio);
    }
    function initNodes(){
      const count = Math.min(maxNodes, Math.floor((w*h) / density));
      nodes = Array.from({length: count}, () => ({
        x: Math.random()*w, y: Math.random()*h,
        vx: (Math.random()-0.5)*0.34, vy: (Math.random()-0.5)*0.34,
        radius: 1.15 + Math.random()*1.15,
        alpha: 0.32 + Math.random()*0.34,
        accent: Math.random() > 0.82
      }));
      // designate a slow-drifting "core" hub node near center — always connected
      // to its nearest neighbors, giving a neural-network / infrastructure-hub look
      if(opts.coreNode && nodes.length){
        nodes[0].x = w/2; nodes[0].y = h/2;
        nodes[0].vx = (Math.random()-0.5)*0.14;
        nodes[0].vy = (Math.random()-0.5)*0.14;
        nodes[0].isCore = true;
      }
    }
    function step(now = performance.now()){
      frameId = 0;
      const frameScale = lastFrame ? Math.min(2, (now - lastFrame) / 16.667) : 1;
      lastFrame = now;
      ctx.clearRect(0,0,w,h);
      if(animate){
        for(const n of nodes){
          n.x += n.vx * frameScale; n.y += n.vy * frameScale;
          if(n.x<0||n.x>w) n.vx*=-1;
          if(n.y<0||n.y>h) n.vy*=-1;
        }
      }
      // ambient node-to-node links
      for(let i=0;i<nodes.length;i++){
        for(let j=i+1;j<nodes.length;j++){
          const a=nodes[i], b=nodes[j];
          const dx=a.x-b.x, dy=a.y-b.y;
          const maxDist = 215*pixelRatio;
          const distanceSquared = dx*dx+dy*dy;
          if(distanceSquared < maxDist*maxDist){
            const dist=Math.sqrt(distanceSquared);
            const alpha = (1-dist/maxDist)*0.3;
            ctx.strokeStyle = (a.accent || b.accent)
              ? `rgba(86,205,224,${alpha*0.72})`
              : `rgba(78,145,255,${alpha})`;
            ctx.lineWidth = 0.9*pixelRatio;
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
        const reach = 310 * pixelRatio;
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
        const pulse = 0.55 + Math.sin(now/900) * 0.25;
        const coreGrad = ctx.createRadialGradient(core.x,core.y,0, core.x,core.y, 26*pixelRatio);
        coreGrad.addColorStop(0, `rgba(120,180,255,${pulse})`);
        coreGrad.addColorStop(1, 'rgba(120,180,255,0)');
        ctx.fillStyle = coreGrad;
        ctx.beginPath();
        ctx.arc(core.x, core.y, 26*pixelRatio, 0, Math.PI*2);
        ctx.fill();
        ctx.fillStyle = '#dce9ff';
        ctx.beginPath();
        ctx.arc(core.x, core.y, 3.4*pixelRatio, 0, Math.PI*2);
        ctx.fill();
      }
      // Cursor becomes a clean network node: connected lines without a circular spotlight.
      if(mouse.active && mouse.x !== null){
        const mx = mouse.x * pixelRatio, my = mouse.y * pixelRatio;
        const reach = 300 * pixelRatio;
        for(const n of nodes){
          const dx = n.x-mx, dy = n.y-my;
          const dist = Math.sqrt(dx*dx+dy*dy);
          if(dist < reach){
            const t = 1 - dist/reach;
            ctx.strokeStyle = n.accent
              ? `rgba(95,222,226,${t*0.7})`
              : `rgba(92,153,255,${t*0.68})`;
            ctx.lineWidth = 1.15*pixelRatio;
            ctx.beginPath();
            ctx.moveTo(mx,my); ctx.lineTo(n.x,n.y);
            ctx.stroke();
            ctx.fillStyle = `rgba(87,137,220,${t})`;
            ctx.beginPath();
            ctx.arc(n.x, n.y, 2.2*pixelRatio, 0, Math.PI*2);
            ctx.fill();
          }
        }
        ctx.fillStyle = '#8bc2ff';
        ctx.beginPath();
        ctx.arc(mx,my, 2.1*pixelRatio, 0, Math.PI*2);
        ctx.fill();
      }
      for(const n of nodes){
        ctx.fillStyle = n.accent
          ? `rgba(104,225,220,${n.alpha})`
          : `rgba(105,158,238,${n.alpha})`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius*pixelRatio, 0, Math.PI*2);
        ctx.fill();
      }
      if(animate && inViewport && document.visibilityState === 'visible') frameId = requestAnimationFrame(step);
    }
    function start(){
      if(!animate){ step(); return; }
      if(!frameId && inViewport && document.visibilityState === 'visible') frameId = requestAnimationFrame(step);
    }
    function stop(){
      if(frameId){ cancelAnimationFrame(frameId); frameId = 0; }
    }
    let resizeFrame = 0;
    window.addEventListener('resize', () => {
      if(resizeFrame) return;
      resizeFrame = requestAnimationFrame(() => {
        resizeFrame = 0;
        resize(); initNodes(); start();
      });
    }, {passive:true});
    if(animate && interactive) hostEl.addEventListener('pointermove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    });
    if(animate && interactive) hostEl.addEventListener('pointerleave', () => { mouse.active = false; });
    if(animate && interactive) hostEl.addEventListener('touchmove', (e) => {
      const rect = canvas.getBoundingClientRect();
      const t = e.touches[0];
      mouse.x = t.clientX - rect.left;
      mouse.y = t.clientY - rect.top;
      mouse.active = true;
    }, {passive:true});
    if(animate && interactive) hostEl.addEventListener('touchend', () => { mouse.active = false; });
    if('IntersectionObserver' in window){
      const canvasObserver = new IntersectionObserver(entries => {
        inViewport = Boolean(entries[0]?.isIntersecting);
        inViewport ? start() : stop();
      }, {rootMargin:'100px'});
      canvasObserver.observe(hostEl);
    }
    document.addEventListener('visibilitychange', () => document.visibilityState === 'visible' ? start() : stop());
    resize(); initNodes(); start();
  }

  initNetwork('netCanvas', document.querySelector('.hero'), {coreNode:true, interactive:true});

  // Reliable card-by-card review autoplay. User interaction pauses it briefly;
  // hovering alone does not stop playback, so desktop visitors can see it move.
  function initReviewAutoScroll(){
    const track = document.querySelector('.reviews .rgrid');
    const toggle = document.querySelector('[data-review-autoplay]');
    if(!track || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let timerId = 0;
    let inViewport = true;
    let userPaused = false;
    let resumeTimer = 0;
    let activeIndex = 0;
    const interval = 2200;
    const progress = document.querySelector('.review-progress span');
    const cards = Array.from(track.querySelectorAll('.rcard'));

    function updateToggle(){
      if(!toggle) return;
      toggle.setAttribute('aria-pressed', String(userPaused));
      toggle.textContent = userPaused ? 'เล่นต่อ' : 'หยุดเลื่อน';
    }
    function stop(){
      if(timerId){ window.clearTimeout(timerId); timerId = 0; }
    }
    function start(){
      if(timerId || userPaused || !inViewport || document.visibilityState !== 'visible' || cards.length < 2) return;
      timerId = window.setTimeout(advance, interval);
    }
    function hold(ms){
      stop();
      window.clearTimeout(resumeTimer);
      resumeTimer = window.setTimeout(start, ms);
    }
    function advance(){
      timerId = 0;
      if(userPaused || !inViewport || document.visibilityState !== 'visible') return;
      const maxScroll = Math.max(0, track.scrollWidth - track.clientWidth);
      if(maxScroll <= 1) return;
      const cardStep = cards[1] ? cards[1].offsetLeft - cards[0].offsetLeft : cards[0].offsetWidth + 18;
      const finalIndex = Math.max(1, Math.ceil(maxScroll / Math.max(1, cardStep)));
      activeIndex = (activeIndex + 1) % (finalIndex + 1);
      const target = Math.min(maxScroll, activeIndex * cardStep);
      track.scrollTo({left:target, behavior:'smooth'});
      start();
    }

    track.addEventListener('pointerdown', () => hold(3600), {passive:true});
    track.addEventListener('touchstart', () => hold(3600), {passive:true});
    track.addEventListener('wheel', () => hold(3600), {passive:true});
    track.addEventListener('keydown', () => hold(3600));
    track.addEventListener('scroll', () => {
      const maxScroll = Math.max(1, track.scrollWidth - track.clientWidth);
      const cardStep = cards[1] ? cards[1].offsetLeft - cards[0].offsetLeft : cards[0].offsetWidth + 18;
      activeIndex = Math.round(track.scrollLeft / Math.max(1, cardStep));
      if(progress) progress.style.transform = `translate3d(${Math.max(0, Math.min(1, track.scrollLeft / maxScroll)) * 316}%,0,0)`;
    }, {passive:true});
    toggle?.addEventListener('click', () => {
      userPaused = !userPaused;
      updateToggle();
      if(userPaused){
        stop();
        window.clearTimeout(resumeTimer);
      } else {
        start();
      }
    });
    if('IntersectionObserver' in window){
      const observer = new IntersectionObserver(([entry]) => {
        inViewport = Boolean(entry?.isIntersecting);
        inViewport ? start() : stop();
      }, {rootMargin:'120px'});
      observer.observe(track);
    }
    document.addEventListener('visibilitychange', () => document.visibilityState === 'visible' ? start() : stop());
    updateToggle();
    start();
  }
  initReviewAutoScroll();

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

    const teaserKey = 'pond-chat-teaser-seen';
    function hideTeaser(){
      teaser && teaser.classList.remove('show');
      try { sessionStorage.setItem(teaserKey, '1'); } catch(e) {}
    }
    let previousFocus = null;
    const focusableSelector = 'a[href],button:not([disabled]),input:not([disabled]),[tabindex]:not([tabindex="-1"])';
    function openPanel(){
      previousFocus = document.activeElement;
      panel.classList.add('open');
      panel.setAttribute('aria-hidden','false');
      toggle.setAttribute('aria-expanded','true');
      document.body.classList.add('chat-open');
      hideTeaser();
      requestAnimationFrame(() => panel.querySelector(focusableSelector)?.focus());
    }
    function closePanel(restoreFocus = true){
      panel.classList.remove('open');
      panel.setAttribute('aria-hidden','true');
      toggle.setAttribute('aria-expanded','false');
      document.body.classList.remove('chat-open');
      if(restoreFocus && previousFocus instanceof HTMLElement) previousFocus.focus();
      previousFocus = null;
    }

    toggle.addEventListener('click', () => {
      panel.classList.contains('open') ? closePanel() : openPanel();
    });
    panelClose && panelClose.addEventListener('click', closePanel);
    teaserClose && teaserClose.addEventListener('click', (e) => { e.stopPropagation(); hideTeaser(); });
    if(teaser){
      teaser.setAttribute('role','button');
      teaser.setAttribute('tabindex','0');
      teaser.setAttribute('aria-label','เปิดช่องทางติดต่อ');
      teaser.addEventListener('click', openPanel);
      teaser.addEventListener('keydown', event => { if(event.key === 'Enter' || event.key === ' '){ event.preventDefault(); openPanel(); } });
    }
    document.addEventListener('click', (e) => {
      if(panel.classList.contains('open') && !panel.contains(e.target) && !toggle.contains(e.target)){
        closePanel(false);
      }
    });
    document.addEventListener('keydown', event => {
      if(!panel.classList.contains('open')) return;
      if(event.key === 'Escape'){
        event.preventDefault();
        closePanel();
        return;
      }
      if(event.key !== 'Tab') return;
      const focusable = Array.from(panel.querySelectorAll(focusableSelector)).filter(element => !element.hidden && element.getClientRects().length);
      if(!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if(event.shiftKey && document.activeElement === first){ event.preventDefault(); last.focus(); }
      else if(!event.shiftKey && document.activeElement === last){ event.preventDefault(); first.focus(); }
    });

    panel.setAttribute('aria-hidden','true');
    toggle.setAttribute('aria-expanded','false');
    let teaserSeen = false;
    try { teaserSeen = sessionStorage.getItem(teaserKey) === '1'; } catch(e) {}
    if(!teaserSeen){
      setTimeout(() => { if(!panel.classList.contains('open')) teaser && teaser.classList.add('show'); }, 8000);
      setTimeout(hideTeaser, 16000);
    }
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
      if(btn && box && img) {
        img.src = btn.dataset.lightbox;
        box.classList.add('open');
        document.body.style.overflow = 'hidden';
      }
    });

    function hide(){
      if(!box || !img) return;
      box.classList.remove('open');
      document.body.style.overflow = '';
      img.removeAttribute('src');
    }
    close && close.addEventListener('click', hide);
    box && box.addEventListener('click', e => { if(e.target === box) hide(); });
    document.addEventListener('keydown', e => { if(e.key === 'Escape') hide(); });

    document.querySelectorAll('[data-scroll-contact]').forEach(el => {
      el.addEventListener('click', () => {
        document.getElementById('contact')?.scrollIntoView({behavior:'smooth'});
      });
    });
  })();


/* =========================================================
   SCROLL REVEAL — lightweight and motion-safe
   ========================================================= */
(function(){
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

})();

/* Small usability details shared by public pages. */
(function(){
  const progress = document.createElement("div");
  progress.className = "page-progress";
  progress.setAttribute("aria-hidden", "true");
  document.body.prepend(progress);
  const updateProgress = () => {
    const maximum = document.documentElement.scrollHeight - innerHeight;
    progress.style.transform = `scaleX(${maximum > 0 ? Math.min(1, scrollY / maximum) : 0})`;
  };
  addEventListener("scroll", updateProgress, {passive:true});
  addEventListener("resize", updateProgress, {passive:true});
  updateProgress();

  const currentPage = location.pathname.split("/").pop() || "index.html";
  const navigationPage = currentPage.startsWith("article-")
    ? "articles.html"
    : (/^course-|^it-procurement-toolkit/.test(currentPage) ? "courses.html" : currentPage);
  const navLinks = Array.from(document.querySelectorAll(".links a"));
  const hasExactHashLink = Boolean(location.hash) && navLinks.some(link => {
    const [page = "index.html", hash = ""] = (link.getAttribute("href") || "").split("#");
    return (page || "index.html") === navigationPage && `#${hash}` === location.hash;
  });
  navLinks.forEach(link => {
    const [rawPage = "index.html", hash = ""] = (link.getAttribute("href") || "").split("#");
    const page = rawPage || "index.html";
    const isCurrent = page === navigationPage && (hasExactHashLink ? `#${hash}` === location.hash : !hash);
    if(isCurrent){
      link.classList.add("is-current");
      link.setAttribute("aria-current", "page");
    }
  });

  document.querySelectorAll(".course-card").forEach(card => {
    const media = card.querySelector(".course-media");
    const courseLink = card.querySelector('a[href^="course-"]');
    if(!media || !courseLink || media.querySelector(".access-pill")) return;
    const pill = document.createElement("span");
    pill.className = "access-pill";
    pill.textContent = "เปิดเนื้อหาได้";
    media.appendChild(pill);
    card.classList.add("has-private-access");
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

  // Prevent pointer-follow transforms from creating shaking on touch devices.
  if (window.matchMedia("(pointer:coarse)").matches) {
    document.documentElement.classList.add("coarse-pointer");
  }
})();



(function(){
  document.addEventListener("click",async event=>{
    const button=event.target.closest("[data-copy-code]");
    if(!button) return;
    const code=button.closest(".command-box")?.querySelector("code")?.textContent||"";
    try{
      await navigator.clipboard.writeText(code);
      const old=button.textContent; button.textContent="คัดลอกแล้ว"; button.classList.add("copied");
      setTimeout(()=>{button.textContent=old;button.classList.remove("copied")},1500);
    }catch(error){ button.textContent="เลือกข้อความแล้วคัดลอก"; }
  });
  document.querySelectorAll('[data-print-article]').forEach(button => button.addEventListener('click', () => window.print()));
})();

(function(){
  document.querySelectorAll('.article-toc-toggle').forEach(button => {
    const toc = button.closest('.article-toc');
    if(!toc) return;
    button.addEventListener('click', () => {
      const open = toc.classList.toggle('is-open');
      button.setAttribute('aria-expanded', String(open));
    });
    toc.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
      if(matchMedia('(max-width:900px)').matches){
        toc.classList.remove('is-open');
        button.setAttribute('aria-expanded','false');
      }
    }));
  });
})();

/* ===== integrated analytics.js ===== */
"use strict";
(function(){
  const endpoint = document.querySelector('meta[name="analytics-endpoint"]')?.content?.trim() || window.POND_ANALYTICS_ENDPOINT || "";
  const privacyEnabled = navigator.globalPrivacyControl === true || navigator.doNotTrack === "1";
  const page = location.pathname.split("/").pop() || "index.html";
  const kind = page.startsWith("article-") ? "article" : page.startsWith("course-") ? "course" : "page";

  function track(event,properties={}){
    if(!endpoint || privacyEnabled) return;
    const payload = JSON.stringify({version:1,event,page,kind,properties,timestamp:new Date().toISOString()});
    if(navigator.sendBeacon) navigator.sendBeacon(endpoint,new Blob([payload],{type:"application/json"}));
    else fetch(endpoint,{method:"POST",headers:{"content-type":"application/json"},body:payload,keepalive:true,credentials:"omit"}).catch(()=>{});
  }
  window.pondTrack = track;
  track("page_view",{title:document.title});

  document.addEventListener("click",event=>{
    const link = event.target.closest("a[href]");
    if(link){
      const href=link.getAttribute("href")||"";
      if(/line\.me|mailto:|fastwork\.co/.test(href)) track("contact_click",{channel:href.startsWith("mailto:")?"email":href.includes("line.me")?"line":"fastwork"});
      if(/^course-|^it-procurement-toolkit/.test(href)) track("course_open",{course:href.split("?")[0]});
    }
    const filter=event.target.closest("[data-article-filter],[data-course-filter],[data-project-filter]");
    if(filter) track("filter_change",{filter:filter.dataset.articleFilter||filter.dataset.courseFilter||filter.dataset.projectFilter||"all"});
  });

  ["articleSearch","courseSearch","projectSearch"].forEach(id=>{
    const input=document.getElementById(id); if(!input) return;
    let timer;
    input.addEventListener("input",()=>{
      clearTimeout(timer);
      timer=setTimeout(()=>{
        const length=input.value.trim().length;
        if(length<2) return;
        const countId=id.replace("Search","ResultCount");
        const visibleCount=parseInt(document.getElementById(countId)?.textContent||"",10);
        track("search",{
          scope:id.replace("Search","").toLowerCase(),
          lengthBucket:length<5?"2-4":length<11?"5-10":"11+",
          results:Number.isFinite(visibleCount)?visibleCount:null
        });
      },800);
    });
  });
})();
