"use strict";
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
    const hasDiscoveryControls = Boolean(search || filters.length || more);
    if(!cards.length || !parent || !hasDiscoveryControls) return;

    const urlState = new URLSearchParams(location.search);
    let active = urlState.get(opts.categoryParam || "category") || "all";
    if(!filters.some(button => (button.dataset[opts.filterDataset] || "all") === active)) active = "all";
    if(search) search.value = urlState.get(opts.queryParam || "q") || "";
    let expanded = active !== "all" || Boolean(search?.value);
    const defaultLimit = opts.defaultLimit;

    const empty = document.createElement("div");
    empty.className = "discovery-empty ux-hidden";
    empty.innerHTML = `<b>${opts.emptyTitle}</b><span>${opts.emptyHint}</span><button type="button">ล้างคำค้นและตัวกรอง</button>`;
    parent.appendChild(empty);
    const emptyReset = empty.querySelector("button");

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
      empty.hidden = matches.length !== 0;

      if(count){
        count.textContent = matches.length + " " + opts.unit;
      }

      if(more){
        more.setAttribute("aria-expanded", expanded ? "true" : "false");
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
      const params = new URLSearchParams(location.search);
      const queryValue = search?.value.trim() || "";
      queryValue ? params.set(opts.queryParam || "q", queryValue) : params.delete(opts.queryParam || "q");
      active !== "all" ? params.set(opts.categoryParam || "category", active) : params.delete(opts.categoryParam || "category");
      const query = params.toString();
      history.replaceState(null, "", `${location.pathname}${query ? `?${query}` : ""}${location.hash}`);
    }

    filters.forEach(btn => btn.addEventListener("click", () => {
      filters.forEach(x => x.classList.remove("active"));
      filters.forEach(x => x.setAttribute("aria-pressed", "false"));
      btn.classList.add("active");
      btn.setAttribute("aria-pressed", "true");
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
      const updateClear = () => { clear.hidden = !search.value; };
      clear.addEventListener("click", () => {
        search.value = "";
        search.focus();
        expanded = false;
        updateClear();
        apply();
      });
      search.addEventListener("input", updateClear);
      updateClear();
    }
    emptyReset && emptyReset.addEventListener("click", () => {
      active = "all";
      expanded = false;
      if(search) search.value = "";
      if(clear) clear.hidden = true;
      filters.forEach(button => button.classList.toggle("active", button.dataset[opts.filterDataset] === "all"));
      filters.forEach(button => button.setAttribute("aria-pressed", button.dataset[opts.filterDataset] === "all" ? "true" : "false"));
      apply();
      search && search.focus();
    });
    if(count) count.setAttribute("aria-live", "polite");
    filters.forEach(button => {
      const selected = (button.dataset[opts.filterDataset] || "all") === active;
      button.classList.toggle("active", selected);
      button.setAttribute("aria-pressed", selected ? "true" : "false");
    });
    if(search){
      document.addEventListener("keydown", event => {
        if(event.key === "/" && !/input|textarea|select/i.test(document.activeElement?.tagName || "")){
          event.preventDefault();
          search.focus();
        }
        if(event.key === "Escape" && document.activeElement === search && search.value){
          search.value = "";
          if(clear) clear.hidden = true;
          apply();
        }
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
    emptyTitle:"ไม่พบคอร์สที่ตรงกับคำค้น",
    emptyHint:"ลองใช้คำสั้นลงหรือเลือกหมวด “ทั้งหมด”",
    moreText:"ดูคอร์สเพิ่มเติม",
    collapseText:"ย่อรายการคอร์ส",
    queryParam:"q",
    categoryParam:"category"
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
    emptyTitle:"ไม่พบโปรเจกต์ที่ตรงกับคำค้น",
    emptyHint:"ลองใช้คำสั้นลงหรือเลือกหมวด “ทั้งหมด”",
    moreText:"ดูโปรเจกต์เพิ่มเติม",
    collapseText:"ย่อรายการโปรเจกต์",
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

  // Smooth internal navigation where supported.
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener("click", e => {
      const target = document.querySelector(a.getAttribute("href"));
      if(!target) return;
      e.preventDefault();
      target.scrollIntoView({behavior:"smooth", block:"start"});
      history.replaceState(null,"",`${location.pathname}${location.search}${a.getAttribute("href")}`);
    });
  });
})();
