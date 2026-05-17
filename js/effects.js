import { buildGoogleCalendarUrl } from "./calendar.js";

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function createEffects({ getState, t }) {
  let modalEl = null;
  let lastFocused = null;

  function init() {
    injectModal();
    bindModal();
    bindKeyboard();
    updateModalLabels();
  }

  function injectModal() {
    if (document.getElementById("session-modal")) return;

    modalEl = document.createElement("div");
    modalEl.id = "session-modal";
    modalEl.className = "session-modal";
    modalEl.hidden = true;
    modalEl.innerHTML = `
      <div class="session-modal__backdrop" data-close></div>
      <div class="session-modal__dialog" role="dialog" aria-modal="true" aria-labelledby="session-modal-title">
        <button type="button" class="session-modal__close" data-close aria-label="">×</button>
        <p class="session-modal__meta" id="session-modal-meta"></p>
        <h2 class="session-modal__title" id="session-modal-title"></h2>
        <p class="session-modal__theme" id="session-modal-theme"></p>
        <div class="session-modal__calendar" id="session-modal-calendar">
          <p class="session-modal__calendar-label" id="session-modal-calendar-label"></p>
          <div class="session-modal__calendar-actions" id="session-modal-calendar-actions">
            <a class="session-modal__calendar-btn" id="session-cal-google" target="_blank" rel="noopener noreferrer"></a>
          </div>
        </div>
      </div>`;
    document.body.appendChild(modalEl);
  }

  function updateModalLabels() {
    const closeBtn = modalEl?.querySelector(".session-modal__close");
    if (closeBtn && t) closeBtn.setAttribute("aria-label", t("modalClose"));

    const calLabel = document.getElementById("session-modal-calendar-label");
    const googleBtn = document.getElementById("session-cal-google");

    if (calLabel && t) calLabel.textContent = t("addToCalendar");
    if (googleBtn && t) googleBtn.textContent = t("calendarGoogle");
  }

  function buildCalendarPayload(detail, state) {
    const eventTitle = state.data?.event?.title || "CEEDUCON";
    const description = [detail.theme, eventTitle].filter(Boolean).join(" · ");
    return {
      title: detail.title,
      start: detail.start,
      end: detail.end,
      date: detail.date,
      location: detail.rooms,
      description,
    };
  }

  function updateCalendarActions(detail, state) {
    const calendarEl = document.getElementById("session-modal-calendar");
    const googleBtn = document.getElementById("session-cal-google");

    const hasSchedule = Boolean(detail.date && detail.start && detail.end);
    calendarEl?.classList.toggle("is-hidden", !hasSchedule);

    if (!hasSchedule || !googleBtn) return;

    const payload = buildCalendarPayload(detail, state);
    googleBtn.href = buildGoogleCalendarUrl(payload);
  }

  function openModal(detail) {
    if (!modalEl) return;
    const state = getState();
    lastFocused = document.activeElement;
    updateModalLabels();
    const titleEl = document.getElementById("session-modal-title");
    const metaEl = document.getElementById("session-modal-meta");
    const themeEl = document.getElementById("session-modal-theme");

    titleEl.textContent = detail.title;
    metaEl.innerHTML = `<span>${detail.time}</span> · <span>${detail.rooms}</span>`;
    themeEl.textContent = detail.theme || "";
    themeEl.style.color = detail.themeColor || "";
    themeEl.style.borderLeft = detail.themeColor ? `3px solid ${detail.themeColor}` : "none";
    themeEl.style.paddingLeft = detail.theme ? "0.75rem" : "0";

    updateCalendarActions(detail, state);

    modalEl.hidden = false;
    document.body.classList.add("modal-open");
    modalEl.querySelector(".session-modal__close")?.focus();
  }

  function closeModal() {
    if (!modalEl) return;
    modalEl.hidden = true;
    document.body.classList.remove("modal-open");
    if (lastFocused && typeof lastFocused.focus === "function") {
      lastFocused.focus();
    }
    lastFocused = null;
  }

  function bindModal() {
    document.addEventListener("click", (e) => {
      const trigger = e.target.closest("[data-session-trigger]");
      if (trigger) {
        e.preventDefault();
        openModal({
          title: trigger.dataset.sessionTitle,
          time: trigger.dataset.sessionTime,
          start: trigger.dataset.sessionStart,
          end: trigger.dataset.sessionEnd,
          date: trigger.dataset.sessionDate,
          rooms: trigger.dataset.sessionRooms,
          theme: trigger.dataset.sessionTheme,
          themeColor: trigger.dataset.sessionThemeColor,
        });
        return;
      }
      if (e.target.closest("[data-close]")) closeModal();
    });
  }

  function bindKeyboard() {
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modalEl && !modalEl.hidden) {
        closeModal();
        return;
      }
      const trigger = e.target.closest("[data-session-trigger]");
      if (trigger && (e.key === "Enter" || e.key === " ")) {
        e.preventDefault();
        trigger.click();
      }
    });
  }

  function observeReveals() {
    if (prefersReducedMotion()) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.06, rootMargin: "0px 0px -24px 0px" }
    );

    document.querySelectorAll(".time-block").forEach((block) => {
      block.classList.add("reveal-on-scroll");
      observer.observe(block);

      block.querySelectorAll(".mobile-card").forEach((card, index) => {
        card.classList.add("reveal-on-scroll");
        card.style.setProperty("--reveal-delay", `${index * 70}ms`);
        observer.observe(card);
      });
    });

    document.querySelectorAll(".program-grid__cell--time").forEach((el) => {
      el.classList.add("reveal-on-scroll");
      observer.observe(el);
    });
  }

  function staggerGridRows() {
    if (prefersReducedMotion()) return;

    const timeCells = document.querySelectorAll(".program-grid__cell--time");
    timeCells.forEach((cell, i) => {
      const slotId = cell.dataset.slotId;
      const rowCells = document.querySelectorAll(`[data-slot-id="${slotId}"]`);
      rowCells.forEach((el) => {
        el.classList.add("reveal-row");
        el.style.setProperty("--reveal-delay", `${i * 55}ms`);
      });
    });
  }

  function animateFilterChange() {
    const grid = document.getElementById("program-grid");
    const mobile = document.getElementById("program-mobile");
    [grid, mobile].forEach((el) => {
      if (!el) return;
      el.classList.remove("filter-pulse");
      void el.offsetWidth;
      el.classList.add("filter-pulse");
    });
  }

  function afterRender() {
    staggerGridRows();
    observeReveals();
  }

  return {
    init,
    afterRender,
    animateFilterChange,
    updateModalLabels,
  };
}
