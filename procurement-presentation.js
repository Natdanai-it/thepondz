(function () {
  "use strict";

  const decks = window.PROCUREMENT_DECKS || {};
  const shell = document.getElementById("presenterShell");
  const slide = document.getElementById("presentationSlide");
  const rail = document.getElementById("slideRail");
  const stage = document.getElementById("slideStage");
  const dayButtons = [...document.querySelectorAll("[data-day]")];
  const previousButton = document.getElementById("previousButton");
  const nextButton = document.getElementById("nextButton");
  const fullscreenButton = document.getElementById("fullscreenButton");
  const notesButton = document.getElementById("notesButton");
  const notesPanel = document.getElementById("speakerNotes");
  const notesText = document.getElementById("speakerNotesText");
  const stageDay = document.getElementById("stageDay");
  const stageTitle = document.getElementById("stageTitle");
  const slideStatus = document.getElementById("slideStatus");
  const timeStatus = document.getElementById("timeStatus");
  const progress = document.getElementById("deckProgress");
  const handbookLink = document.getElementById("handbookLink");

  const params = new URLSearchParams(location.search);
  let currentDay = decks[params.get("day")] ? Number(params.get("day")) : 1;
  let currentSlide = 0;
  let notesOpen = false;
  let overflowFrame = 0;

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function listMarkup(items) {
    if (!items?.length) return "";
    return `<ul class="slide-bullets">${items.map(item => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
  }

  function columnsMarkup(columns) {
    if (!columns?.length) return "";
    const columnCount = Math.min(4, columns.length);
    return `<div class="slide-columns" style="--column-count:${columnCount}">${columns.map(column => `
      <section class="slide-column ${escapeHtml(column.className || "")}">
        <h3>${escapeHtml(column.title)}</h3>
        <ul>${(column.items || []).map(item => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
      </section>`).join("")}</div>`;
  }

  function statusClass(value) {
    const text = String(value).toUpperCase();
    if (text.includes("FAIL")) return "status-fail";
    if (text.includes("CHECK") || text.includes("UNKNOWN")) return "status-check";
    if (text.includes("PASS")) return "status-pass";
    return "";
  }

  function tableMarkup(table) {
    if (!table?.headers?.length) return "";
    return `<div class="slide-table-wrap"><table class="slide-table">
      <thead><tr>${table.headers.map(header => `<th>${escapeHtml(header)}</th>`).join("")}</tr></thead>
      <tbody>${(table.rows || []).map(row => `<tr>${row.map(cell => `<td class="${statusClass(cell)}">${escapeHtml(cell)}</td>`).join("")}</tr>`).join("")}</tbody>
    </table></div>`;
  }

  function activityMarkup(data) {
    if (!data.scenario && !data.task) return "";
    return `<div class="activity-box">
      <section class="activity-scenario"><span>SCENARIO</span><p>${escapeHtml(data.scenario)}</p></section>
      <section class="activity-task"><span>YOUR TASK</span><p>${escapeHtml(data.task)}</p></section>
    </div>`;
  }

  function cardsMarkup(cards) {
    if (!cards?.length) return "";
    return `<div class="summary-grid">${cards.map(card => `<section class="summary-card"><b>${escapeHtml(card.title)}</b><p>${escapeHtml(card.text)}</p></section>`).join("")}</div>`;
  }

  function renderSlide() {
    const deck = decks[currentDay];
    const data = deck.slides[currentSlide];
    const elapsedBefore = deck.slides.slice(0, currentSlide).reduce((total, item) => total + (item.duration || 0), 0);
    const elapsedAfter = elapsedBefore + (data.duration || 0);
    const typeClass = data.type === "cover" ? "cover-slide" : data.type === "summary" ? "summary-slide" : data.type === "activity" ? "activity-slide" : "";

    slide.className = `presentation-slide ${typeClass}`;
    slide.scrollTop = 0;
    slide.innerHTML = `
      <span class="slide-duration">${escapeHtml(data.duration)} MIN</span>
      <div class="slide-content">
        <div class="slide-kicker">${escapeHtml(data.kicker || `DAY ${currentDay}`)}</div>
        <h1 class="slide-title">${escapeHtml(data.title)}</h1>
        ${data.subtitle ? `<p class="slide-subtitle">${escapeHtml(data.subtitle)}</p>` : ""}
        ${data.badge ? `<span class="cover-badge">${escapeHtml(data.badge)}</span>` : ""}
        ${columnsMarkup(data.columns)}
        ${activityMarkup(data)}
        ${tableMarkup(data.table)}
        ${listMarkup(data.bullets)}
        ${cardsMarkup(data.cards)}
        ${data.callout ? `<div class="slide-callout">${escapeHtml(data.callout)}</div>` : ""}
      </div>
      <div class="slide-footer"><span>POND NATDANAI · IT PROCUREMENT INTENSIVE</span><b>DAY ${currentDay} · ${String(currentSlide + 1).padStart(2, "0")}</b></div>`;

    stageDay.textContent = `DAY ${currentDay}`;
    stageTitle.textContent = deck.shortTitle;
    slideStatus.textContent = `${currentSlide + 1} / ${deck.slides.length}`;
    timeStatus.textContent = `${elapsedBefore}–${elapsedAfter} / ${deck.totalMinutes} นาที`;
    progress.style.width = `${((currentSlide + 1) / deck.slides.length) * 100}%`;
    notesText.textContent = data.notes || "ไม่มีบันทึกเพิ่มเติมสำหรับสไลด์นี้";
    previousButton.disabled = currentSlide === 0;
    nextButton.disabled = currentSlide === deck.slides.length - 1;
    nextButton.textContent = currentSlide === deck.slides.length - 1 ? "จบ Day นี้" : "ถัดไป →";

    [...rail.querySelectorAll(".rail-item")].forEach((item, index) => {
      item.classList.toggle("active", index === currentSlide);
      if (index === currentSlide) item.scrollIntoView({block: "nearest"});
    });
    cancelAnimationFrame(overflowFrame);
    overflowFrame = requestAnimationFrame(() => {
      const overflowing = slide.scrollHeight > slide.clientHeight + 2;
      slide.classList.toggle("slide-overflowing", overflowing);
      slide.setAttribute("aria-label", overflowing ? "สไลด์มีเนื้อหาต่อด้านล่าง เลื่อนเพื่อดูทั้งหมด" : "สไลด์นำเสนอ");
      if (overflowing) timeStatus.textContent += " · เลื่อนดูต่อในสไลด์";
    });
    stage.focus({preventScroll: true});
  }

  function renderRail() {
    const deck = decks[currentDay];
    rail.innerHTML = `<div class="rail-heading">DAY ${currentDay} · ${deck.slides.length} SLIDES · ${deck.totalMinutes} MIN</div>` +
      deck.slides.map((item, index) => `<button class="rail-item" type="button" data-slide="${index}">
        <span class="rail-number">${String(index + 1).padStart(2, "0")}</span>
        <span class="rail-copy"><b>${escapeHtml(item.title)}</b><small>${escapeHtml(item.duration)} MIN</small></span>
      </button>`).join("");
    rail.querySelectorAll("[data-slide]").forEach(button => button.addEventListener("click", () => {
      currentSlide = Number(button.dataset.slide);
      renderSlide();
    }));
  }

  function setDay(day, replaceHistory = false) {
    if (!decks[day]) return;
    currentDay = Number(day);
    currentSlide = 0;
    dayButtons.forEach(button => button.classList.toggle("active", Number(button.dataset.day) === currentDay));
    handbookLink.href = decks[currentDay].handbook;
    try {
      const nextUrl = new URL(location.href);
      nextUrl.searchParams.set("day", currentDay);
      history[replaceHistory ? "replaceState" : "pushState"]({day: currentDay}, "", nextUrl);
    } catch (_) {
      // Local file previews can block History API updates. Rendering must continue.
    }
    renderRail();
    renderSlide();
  }

  function moveSlide(delta) {
    const target = currentSlide + delta;
    if (target < 0 || target >= decks[currentDay].slides.length) return;
    currentSlide = target;
    renderSlide();
  }

  function toggleNotes(force) {
    notesOpen = typeof force === "boolean" ? force : !notesOpen;
    notesPanel.hidden = !notesOpen;
    notesButton.setAttribute("aria-pressed", String(notesOpen));
  }

  async function toggleFullscreen() {
    if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
      try { await document.documentElement.requestFullscreen(); } catch (_) { shell.classList.toggle("is-fullscreen"); }
    } else if (document.fullscreenElement && document.exitFullscreen) {
      await document.exitFullscreen();
    } else {
      shell.classList.toggle("is-fullscreen");
    }
  }

  dayButtons.forEach(button => button.addEventListener("click", () => setDay(Number(button.dataset.day))));
  previousButton.addEventListener("click", () => moveSlide(-1));
  nextButton.addEventListener("click", () => moveSlide(1));
  notesButton.addEventListener("click", () => toggleNotes());
  fullscreenButton.addEventListener("click", toggleFullscreen);

  document.addEventListener("fullscreenchange", () => {
    shell.classList.toggle("is-fullscreen", Boolean(document.fullscreenElement));
    fullscreenButton.textContent = document.fullscreenElement ? "ออกเต็มจอ" : "เต็มจอ";
  });

  addEventListener("keydown", event => {
    if (["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement?.tagName)) return;
    if (event.key === "ArrowRight" || event.key === "PageDown" || event.key === " ") {
      event.preventDefault(); moveSlide(1);
    }
    if (event.key === "ArrowLeft" || event.key === "PageUp") {
      event.preventDefault(); moveSlide(-1);
    }
    if (event.key === "Home") { event.preventDefault(); currentSlide = 0; renderSlide(); }
    if (event.key === "End") { event.preventDefault(); currentSlide = decks[currentDay].slides.length - 1; renderSlide(); }
    if (event.key.toLowerCase() === "f") toggleFullscreen();
    if (event.key.toLowerCase() === "n") toggleNotes();
    if (event.key === "Escape" && shell.classList.contains("is-fullscreen") && !document.fullscreenElement) shell.classList.remove("is-fullscreen");
  });

  addEventListener("popstate", () => {
    const day = Number(new URLSearchParams(location.search).get("day"));
    if (decks[day]) setDay(day, true);
  });

  addEventListener("resize", () => renderSlide(), {passive: true});

  setDay(currentDay, true);
})();
