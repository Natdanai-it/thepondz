"use strict";
(() => {
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const scrollBehavior = () => motion.matches ? 'instant' : 'smooth';
  let liveMessage;
  function announce(message){
    if(!liveMessage){
      liveMessage = document.createElement('div');
      liveMessage.className = 'sr-only';
      liveMessage.setAttribute('role','status');
      liveMessage.setAttribute('aria-live','polite');
      document.body.appendChild(liveMessage);
    }
    liveMessage.textContent = message;
  }
  async function copyText(text){
    if(navigator.clipboard?.writeText){
      try { await navigator.clipboard.writeText(text); return; } catch {}
    }
    const focus = document.activeElement;
    const field = document.createElement('textarea');
    field.value = text;
    field.className = 'copy-fallback';
    field.setAttribute('readonly','');
    document.body.appendChild(field);
    field.select();
    let copied = false;
    try { copied = document.execCommand('copy'); } finally { field.remove(); focus?.focus({preventScroll:true}); }
    if(!copied) throw new Error('COPY_UNAVAILABLE');
  }
  window.PondUI = {motion, scrollBehavior, announce, copyText};

  function initNavigation(){
    const links = Array.from(document.querySelectorAll('.links a,.mobile-quick-nav a,.mobile-action-bar a'));
    const page = location.pathname.split('/').pop() || 'index.html';
    const isHome = page === 'index.html';
    const category = page.startsWith('article-') ? 'articles.html' : /^course-|^it-procurement-toolkit/.test(page) ? 'courses.html' : page;
    const sectionLinks = links.map(link => {
      const url = new URL(link.href,location.href);
      let section = null;
      try { if(url.pathname === location.pathname && url.hash) section = document.getElementById(decodeURIComponent(url.hash.slice(1))); } catch {}
      return {link,url,section};
    });
    const progress = document.createElement('div');
    progress.className = 'page-progress';
    progress.setAttribute('aria-hidden','true');
    const top = document.createElement('button');
    top.className = 'back-top'; top.type = 'button'; top.textContent = '↑';
    top.setAttribute('aria-label','กลับขึ้นด้านบน');
    if(!document.body.hasAttribute('data-course-payload')){ document.body.prepend(progress); document.body.appendChild(top); }
    top.addEventListener('click', () => window.scrollTo({top:0,behavior:scrollBehavior()}));
    function update(){
      const maximum = document.documentElement.scrollHeight - innerHeight;
      progress.style.transform = `scaleX(${maximum > 0 ? Math.max(0,Math.min(1,scrollY / maximum)) : 0})`;
      const showTop = window.scrollY > 650;
      top.classList.toggle('show',showTop);
      top.tabIndex = showTop ? 0 : -1;
      top.setAttribute('aria-hidden',String(!showTop));
      let currentHash = '';
      if(isHome){
        let nearest = -Infinity;
        sectionLinks.forEach(({section,url}) => {
          if(!section) return;
          const y = section.getBoundingClientRect().top;
          if(y <= 150 && y > nearest){nearest = y; currentHash = url.hash;}
        });
      }
      sectionLinks.forEach(({link,url}) => {
        const linkPage = url.pathname.split('/').pop() || 'index.html';
        const current = url.origin === location.origin && linkPage === category &&
          (isHome ? (currentHash ? url.hash === currentHash : !url.hash || url.hash === '#top') : !url.hash);
        link.classList.toggle('is-current', current);
        link.classList.remove('active');
        if(current) link.setAttribute('aria-current',isHome && currentHash && currentHash !== '#top' ? 'location' : 'page');
        else link.removeAttribute('aria-current');
      });
    }
    let frame = 0;
    function requestUpdate(){
      if(frame) return;
      frame = requestAnimationFrame(() => { frame = 0; update(); });
    }
    ['scroll','resize','hashchange','popstate'].forEach(name => window.addEventListener(name,requestUpdate,{passive:true}));
    document.addEventListener('pond:content-change',requestUpdate);
    update();
    // Native hash navigation preserves keyboard focus, history and copyable URLs.
    // CSS owns smooth scrolling and the reduced-motion override.
  }
  initNavigation();

  function initCopyButtons(){
    const states = new WeakMap();
    document.addEventListener('click',async event => {
      const button = event.target.closest('[data-copy-code]');
      if(!button) return;
      const code = button.closest('.command-box')?.querySelector('code');
      if(!code) return;
      let state = states.get(button);
      if(!state){ state = {label:button.textContent,timer:0,busy:false}; states.set(button,state); }
      if(state.busy) return;
      clearTimeout(state.timer);
      state.busy = true;
      button.setAttribute('aria-busy','true');
      try {
        await copyText(code.textContent);
        button.textContent = 'คัดลอกแล้ว ✓';
        button.classList.add('copied');
        announce('คัดลอกคำสั่งแล้ว');
      } catch {
        const range = document.createRange(); range.selectNodeContents(code);
        const selection = window.getSelection(); selection?.removeAllRanges(); selection?.addRange(range);
        button.textContent = 'เลือกข้อความแล้ว';
        announce('คัดลอกอัตโนมัติไม่ได้ เลือกข้อความให้แล้ว กรุณาใช้คำสั่งคัดลอกของอุปกรณ์');
      } finally {
        state.busy = false;
        button.removeAttribute('aria-busy');
        state.timer = setTimeout(() => {button.textContent = state.label; button.classList.remove('copied');},2000);
      }
    });
    document.querySelectorAll('[data-print-article]').forEach(button => button.addEventListener('click',() => window.print()));
  }
  initCopyButtons();

// ambient network node animation — reusable, with mouse-reactive burst
  function initNetwork(canvasId, hostEl, opts){
    opts = opts || {};
    const canvas = document.getElementById(canvasId);
    if(!canvas || !hostEl) return;
    const ctx = canvas.getContext('2d', {alpha:true, desynchronized:true});
    if(!ctx) return;
    let w, h, nodes;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const smallScreen = window.matchMedia('(max-width: 720px)').matches;
    let animate = !reduced && !smallScreen;
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
    if(interactive) hostEl.addEventListener('pointermove', (e) => {
      if(!animate) return;
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    });
    if(interactive) hostEl.addEventListener('pointerleave', () => { mouse.active = false; });
    if(interactive) hostEl.addEventListener('touchmove', (e) => {
      if(!animate) return;
      const rect = canvas.getBoundingClientRect();
      const t = e.touches[0];
      mouse.x = t.clientX - rect.left;
      mouse.y = t.clientY - rect.top;
      mouse.active = true;
    }, {passive:true});
    if(interactive) hostEl.addEventListener('touchend', () => { mouse.active = false; });
    if('IntersectionObserver' in window){
      const canvasObserver = new IntersectionObserver(entries => {
        inViewport = Boolean(entries[0]?.isIntersecting);
        inViewport ? start() : stop();
      }, {rootMargin:'100px'});
      canvasObserver.observe(hostEl);
    }
    document.addEventListener('visibilitychange', () => document.visibilityState === 'visible' ? start() : stop());
    const screen = matchMedia('(max-width:720px)');
    function syncMotion(){ stop(); animate = !motion.matches && !screen.matches; lastFrame = 0; start(); }
    motion.addEventListener('change',syncMotion);
    screen.addEventListener('change',syncMotion);
    resize(); initNodes(); start();
  }

  initNetwork('netCanvas', document.querySelector('.hero'), {coreNode:true, interactive:true});

  // One controller owns timing, input, looping and accessible review state.
  function initReviewAutoScroll(){
    const viewport = document.querySelector('.review-viewport');
    const track = viewport?.querySelector('.rgrid');
    const toggle = document.querySelector('[data-review-autoplay]');
    if(!track || !toggle || track.dataset.ready) return;
    track.dataset.ready = 'true';
    const cards = Array.from(track.children);
    const count = cards.length;
    const status = document.querySelector('[data-review-status]');
    const progress = document.querySelector('.review-progress span');
    const previous = document.querySelector('[data-review-previous]');
    const next = document.querySelector('[data-review-next]');
    const interval = 5000;
    let timer = 0, settleTimer = 0, base = 0, cycle = 0, active = 0;
    let inView = !('IntersectionObserver' in window), dragging = false, focused = false;
    let paused = motion.matches, manualPause = false, keyboardIntent = false, moving = false, pointer = null, suppressClick = false;
    const clones = [];

    const stop = () => { clearTimeout(timer); timer = 0; };
    const canPlay = () => count > 1 && cycle > 0 && !paused && !dragging && !focused && inView && !document.hidden;
    function schedule(){
      stop();
      if(canPlay() && !moving) timer = setTimeout(() => move(1), interval);
    }
    function update(){
      toggle.textContent = paused ? 'เล่นต่อ' : 'หยุดเลื่อน';
      toggle.setAttribute('aria-pressed', String(paused));
      toggle.setAttribute('aria-label', paused ? 'เริ่มเลื่อนรีวิวอัตโนมัติ' : 'หยุดเลื่อนรีวิวอัตโนมัติ');
      if(status) status.textContent = `รายการ ${active + 1} / ${count} · ${paused ? 'หยุดอัตโนมัติแล้ว' : focused ? 'หยุดขณะอ่านด้วยแป้นพิมพ์' : 'เลื่อนทุก 5 วินาที'}`;
      track.setAttribute('aria-live', paused || focused ? 'polite' : 'off');
      if(progress){ progress.style.width = `${100 / count}%`; progress.style.transform = `translateX(${active * 100}%)`; }
    }
    function jump(left){ track.scrollTo({left, behavior:'instant'}); }
    function settle(){
      clearTimeout(settleTimer);
      if(dragging || !cycle) return;
      moving = false;
      const relative = ((track.scrollLeft - base) % cycle + cycle) % cycle;
      const normalized = base + relative;
      // Clones are visual only. Normalize to the identical original group after moving.
      if(Math.abs(normalized - track.scrollLeft) > cycle / 2) jump(normalized);
      active = Math.round(relative / (cycle / count)) % count;
      update();
      schedule();
    }
    function move(direction){
      stop();
      if(!cycle || count < 2) return;
      moving = true;
      const index = Math.round((track.scrollLeft - base) / (cycle / count));
      track.scrollTo({left:base + (index + direction) * cycle / count, behavior:motion.matches ? 'instant' : 'smooth'});
      clearTimeout(settleTimer);
      settleTimer = setTimeout(settle, 900);
    }
    function measure(){
      stop();
      clearTimeout(settleTimer);
      if(count < 2) return;
      base = cards[0].offsetLeft - track.firstElementChild.offsetLeft;
      cycle = clones[count].offsetLeft - cards[0].offsetLeft;
      moving = false;
      if(cycle > 0) jump(base + active * cycle / count);
      update();
      schedule();
    }
    if(count < 2){
      toggle.hidden = true;
      if(previous) previous.hidden = true;
      if(next) next.hidden = true;
      return;
    }
    function cloneCard(card){
      const clone = card.cloneNode(true);
      clone.dataset.reviewClone = 'true';
      clone.setAttribute('aria-hidden','true');
      // Hidden from assistive technology and tab order; pointer links remain usable.
      clone.addEventListener('pointerdown', event => event.preventDefault());
      clone.removeAttribute('id');
      clone.querySelectorAll('[id]').forEach(el => el.removeAttribute('id'));
      clone.querySelectorAll('a,button,input,[tabindex]').forEach(el => el.setAttribute('tabindex','-1'));
      return clone;
    }
    const before = document.createDocumentFragment();
    const after = document.createDocumentFragment();
    cards.forEach(card => { const clone = cloneCard(card); clones.push(clone); before.appendChild(clone); });
    cards.forEach((card,index) => {
      card.setAttribute('role','group');
      card.setAttribute('aria-roledescription','รายการรีวิว');
      card.setAttribute('aria-label',`${index + 1} จาก ${count}`);
      const clone = cloneCard(card); clones.push(clone); after.appendChild(clone);
    });
    track.prepend(before);
    track.append(after);
    track.addEventListener('scroll', () => {
      stop();
      clearTimeout(settleTimer);
      settleTimer = setTimeout(settle, 160);
    }, {passive:true});
    track.addEventListener('scrollend', settle);
    track.addEventListener('wheel', () => { stop(); moving = false; clearTimeout(settleTimer); settleTimer = setTimeout(settle,200); }, {passive:true});
    track.addEventListener('pointerdown', event => {
      if(event.button !== 0) return;
      stop();
      dragging = true;
      moving = false;
      suppressClick = false;
      pointer = {id:event.pointerId, x:event.clientX, left:track.scrollLeft, mouse:event.pointerType === 'mouse'};
    }, {passive:true});
    track.addEventListener('pointermove', event => {
      if(!pointer?.mouse || event.pointerId !== pointer.id) return;
      const delta = event.clientX - pointer.x;
      if(!suppressClick && Math.abs(delta) < 8) return;
      suppressClick = true;
      track.classList.add('is-dragging');
      track.setPointerCapture?.(event.pointerId);
      event.preventDefault();
      jump(pointer.left - delta);
    });
    function release(event){
      if(!pointer || event.pointerId !== pointer.id) return;
      dragging = false;
      pointer = null;
      track.classList.remove('is-dragging');
      settle();
      setTimeout(() => { suppressClick = false; }, 0);
    }
    window.addEventListener('pointerup', release);
    window.addEventListener('pointercancel', release);
    track.addEventListener('click', event => {
      if(suppressClick){ event.preventDefault(); event.stopImmediatePropagation(); }
    }, true);
    track.addEventListener('dragstart', event => event.preventDefault());
    window.addEventListener('keydown', event => { if(event.key === 'Tab') keyboardIntent = true; });
    window.addEventListener('pointerdown', () => { keyboardIntent = false; focused = false; update(); }, {capture:true});
    viewport.addEventListener('focusin', event => {
      focused = keyboardIntent || Boolean(event.target.matches?.(':focus-visible'));
      if(focused) stop();
      update();
    });
    viewport.addEventListener('focusout', event => {
      if(viewport.contains(event.relatedTarget)) return;
      focused = false; update(); schedule();
    });
    track.addEventListener('keydown', event => {
      if(event.target !== track || !['ArrowLeft','ArrowRight','Home','End'].includes(event.key)) return;
      event.preventDefault();
      if(event.key === 'ArrowLeft' || event.key === 'ArrowRight') move(event.key === 'ArrowLeft' ? -1 : 1);
      else { active = event.key === 'Home' ? 0 : count - 1; jump(base + active * cycle / count); settle(); }
    });
    toggle.addEventListener('click', () => { paused = !paused; manualPause = paused; update(); schedule(); });
    previous?.addEventListener('click', () => move(-1));
    next?.addEventListener('click', () => move(1));
    motion.addEventListener('change', () => { paused = manualPause || motion.matches; update(); schedule(); });
    document.addEventListener('visibilitychange', () => document.hidden ? stop() : schedule());
    if('IntersectionObserver' in window){
      const observer = new IntersectionObserver(([entry]) => {
        inView = entry.isIntersecting; inView ? schedule() : stop();
      }, {threshold:0.1});
      observer.observe(viewport);
    }
    if('ResizeObserver' in window) new ResizeObserver(measure).observe(track);
    else window.addEventListener('resize', measure, {passive:true});
    document.fonts?.ready.then(measure);
    measure();
  }
  initReviewAutoScroll();

  // ---- animated count-up stats (runs once when the stat bar scrolls into view) ----
  // ---- premium count-up numbers ----
  function animateNumber(el, target, decimals = 0, suffix = ''){
    if(el.dataset.counted === '1') return;
    el.dataset.counted = '1';
    if(motion.matches){ el.textContent = target.toFixed(decimals) + suffix; return; }
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
    panelClose && panelClose.addEventListener('click', () => closePanel());
    teaserClose && teaserClose.addEventListener('click', (e) => { e.stopPropagation(); hideTeaser(); });
    if(teaser){
      teaser.setAttribute('role','button');
      teaser.setAttribute('tabindex','0');
      teaser.setAttribute('aria-label','เปิดช่องทางติดต่อ');
      teaser.addEventListener('click', event => {event.stopPropagation(); openPanel();});
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

  function initLightbox(){
    const box = document.getElementById('lightbox');
    const image = document.getElementById('lightboxImg');
    const close = document.getElementById('lightboxClose');
    let origin = null, overflow = '';
    if(box && image && close){
      box.setAttribute('role','dialog');
      box.setAttribute('aria-modal','true');
      box.setAttribute('aria-label','ภาพขยาย');
      box.setAttribute('aria-hidden','true');
      close.setAttribute('aria-label','ปิดภาพขยาย');
      document.addEventListener('click',event => {
        const button = event.target.closest('[data-lightbox]');
        if(!button) return;
        origin = button;
        overflow = document.body.style.overflow;
        image.src = button.dataset.lightbox;
        image.alt = button.querySelector('img')?.alt || 'ภาพขยาย';
        box.classList.add('open');
        box.setAttribute('aria-hidden','false');
        document.body.style.overflow = 'hidden';
        close.focus();
      });
      function hide(){
        if(!box.classList.contains('open')) return;
        box.classList.remove('open');
        box.setAttribute('aria-hidden','true');
        document.body.style.overflow = overflow;
        image.removeAttribute('src');
        origin?.focus({preventScroll:true}); origin = null;
      }
      close.addEventListener('click',hide);
      box.addEventListener('click',event => { if(event.target === box) hide(); });
      document.addEventListener('keydown',event => {
        if(!box.classList.contains('open')) return;
        if(event.key === 'Escape'){event.preventDefault(); hide();}
        if(event.key === 'Tab'){event.preventDefault(); close.focus();}
      });
    }
    document.querySelectorAll('[data-scroll-contact]').forEach(button => button.addEventListener('click',() => {
      const contact = document.getElementById('contact');
      if(!contact) return;
      contact.scrollIntoView({behavior:scrollBehavior()});
      const heading = contact.querySelector('h2');
      if(heading){heading.tabIndex = -1; heading.focus({preventScroll:true});}
    }));
  }
  initLightbox();

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

/* Shared, optional analytics. No requests without a configured endpoint. */
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

})();
