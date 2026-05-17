import {
  getStoredLang,
  setStoredLang,
  ui,
  getThemeLabel,
  getThemeShort,
  getSlotTitle,
  getSessionTitle,
  formatFilterCount,
  formatSessionAria,
} from "./i18n.js";
import { createEffects } from "./effects.js";

const ROOMS = ["C1", "C2", "C3", "D2", "D3+D4", "D6+D7", "E1", "E2"];
const DESKTOP_MQ = window.matchMedia("(min-width: 900px)");
const CLOCK_SVG = `<svg class="program-grid__time-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2"/><path d="M12 7v5l3 2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`;
const SLOT_ICONS = {
  registration: "📋",
  "coffee-1": "☕",
  "coffee-2": "☕",
  lunch: "🍽",
  opening: "🎤",
};
let effects = null;

const state = {
  data: null,
  lang: getStoredLang(),
  themeMap: {},
  filters: { room: "", theme: "", search: "" },
};

const els = {
  legend: document.getElementById("legend"),
  roomChips: document.getElementById("room-chips"),
  grid: document.getElementById("program-grid"),
  gridHeader: document.getElementById("program-grid-header"),
  mobile: document.getElementById("program-mobile"),
  empty: document.getElementById("program-empty"),
  filterReset: document.getElementById("filter-reset"),
  emptyReset: document.getElementById("empty-reset"),
  filterStatus: document.getElementById("filter-status"),
  loadError: document.getElementById("load-error"),
  loadErrorText: document.getElementById("load-error-text"),
  searchInput: document.getElementById("search-input"),
  printBtn: document.getElementById("print-btn"),
  langButtons: document.querySelectorAll(".lang-switch__btn"),
  programSections: document.querySelectorAll(
    ".toolbar, .legend-panel, .program-grid-wrap, .program-mobile, #program-empty"
  ),
};

function removeLegacyRoomSelect() {
  const legacy = document.getElementById("filter-room");
  if (!legacy) return;
  const group = legacy.closest(".toolbar__group");
  (group || legacy).remove();
}

async function init() {
  try {
    removeLegacyRoomSelect();

    const response = await fetch("data/program.json");
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    state.data = await response.json();
    state.themeMap = Object.fromEntries(state.data.themes.map((t) => [t.id, t]));
    applyStaticI18n();
    syncLangButtons();
    renderLegend();
    renderRoomChips();
    effects = createEffects({
      getState: () => state,
      t,
    });
    effects.init();
    render();
    bindEvents();
    DESKTOP_MQ.addEventListener("change", debounce(render, 150));
  } catch (err) {
    console.error("Failed to load program:", err);
    showLoadError();
  }
}

function showLoadError() {
  els.programSections.forEach((el) => el.classList.add("is-hidden"));
  if (els.loadError) {
    els.loadError.classList.remove("is-hidden");
    if (els.loadErrorText) els.loadErrorText.textContent = ui(getStoredLang(), "loadError");
  }
}

function t(key) {
  return ui(state.lang, key);
}

function applyStaticI18n() {
  document.documentElement.lang = state.lang;

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.dataset.i18n;
    const text = t(key);
    if (el.tagName === "TITLE") {
      document.title = text;
    } else {
      el.textContent = text;
    }
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    el.placeholder = t(el.dataset.i18nPlaceholder);
  });

  document.querySelectorAll("[data-i18n-content]").forEach((el) => {
    el.content = t(el.dataset.i18nContent);
  });

  document.querySelectorAll("[data-i18n-aria]").forEach((el) => {
    el.setAttribute("aria-label", t(el.dataset.i18nAria));
  });

  const backToTop = document.getElementById("back-to-top");
  if (backToTop) backToTop.setAttribute("aria-label", t("backToTop"));
}

function syncLangButtons() {
  els.langButtons.forEach((btn) => {
    const active = btn.dataset.lang === state.lang;
    btn.classList.toggle("is-active", active);
    btn.setAttribute("aria-pressed", String(active));
  });
}

function setLanguage(lang) {
  state.lang = lang;
  setStoredLang(lang);
  syncLangButtons();
  applyStaticI18n();
  renderLegend();
  renderWithFx();
  effects?.updateModalLabels?.();
}

function renderLegend() {
  els.legend.innerHTML = state.data.themes
    .map((theme) => {
      const label = getThemeLabel(theme.id, state.lang);
      const short = getThemeShort(theme.id, state.lang) || label;
      return `
    <button type="button" class="legend__chip" data-theme="${theme.id}" aria-pressed="false">
      <span class="legend__dot" style="background:${theme.color}"></span>
      <span class="legend__label legend__label--full">${label}</span>
      <span class="legend__label legend__label--short">${short}</span>
    </button>`;
    })
    .join("");
  syncChipStates();
}

function renderRoomChips() {
  els.roomChips.innerHTML = ROOMS.map(
    (room) =>
      `<button type="button" class="room-chip" data-room="${room}" aria-pressed="false">${room}</button>`
  ).join("");
}

function syncChipStates() {
  document.querySelectorAll(".legend__chip").forEach((chip) => {
    const active = chip.dataset.theme === state.filters.theme;
    chip.classList.toggle("is-active", active);
    chip.setAttribute("aria-pressed", String(active));
  });

  document.querySelectorAll(".room-chip").forEach((chip) => {
    const active = chip.dataset.room === state.filters.room;
    chip.classList.toggle("is-active", active);
    chip.setAttribute("aria-pressed", String(active));
  });

  els.filterReset?.classList.toggle("is-active", hasActiveFilters());
}

function bindEvents() {
  els.langButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      if (btn.dataset.lang !== state.lang) setLanguage(btn.dataset.lang);
    });
  });

  els.searchInput.addEventListener(
    "input",
    debounce(() => {
      state.filters.search = els.searchInput.value.trim().toLowerCase();
      renderWithFx();
    }, 200)
  );

  els.filterReset.addEventListener("click", resetFilters);
  els.emptyReset?.addEventListener("click", resetFilters);

  els.legend.addEventListener("click", (e) => {
    const chip = e.target.closest(".legend__chip");
    if (!chip) return;
    const themeId = chip.dataset.theme;
    state.filters.theme = state.filters.theme === themeId ? "" : themeId;
    syncChipStates();
    renderWithFx();
  });

  els.roomChips.addEventListener("click", (e) => {
    const chip = e.target.closest(".room-chip");
    if (!chip) return;
    const room = chip.dataset.room;
    state.filters.room = state.filters.room === room ? "" : room;
    syncChipStates();
    renderWithFx();
  });

  els.printBtn.addEventListener("click", () => window.print());

  window.addEventListener("beforeprint", () => {
    if (!DESKTOP_MQ.matches) renderGrid();
    document.body.classList.add("is-printing");
  });

  window.addEventListener("afterprint", () => {
    document.body.classList.remove("is-printing");
    if (!DESKTOP_MQ.matches) render();
  });
}

function resetFilters() {
  state.filters = { room: "", theme: "", search: "" };
  els.searchInput.value = "";
  syncChipStates();
  renderWithFx();
}

function debounce(fn, ms) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}

function formatTimeRange(start, end) {
  return `${start} – ${end}`;
}

function sessionSearchText(session) {
  const cs = getSessionTitle(session, "cs").toLowerCase();
  const en = getSessionTitle(session, "en").toLowerCase();
  return `${cs} ${en}`;
}

function sessionMatchesFilters(session) {
  const { room, theme, search } = state.filters;
  if (theme && session.theme !== theme) return false;
  if (room && !session.rooms.includes(room)) return false;
  if (search && !sessionSearchText(session).includes(search)) return false;
  return true;
}

function slotSearchText(slot) {
  const cs = getSlotTitle(slot, "cs").toLowerCase();
  const en = getSlotTitle(slot, "en").toLowerCase();
  return `${cs} ${en}`;
}

function slotHasVisibleContent(slot) {
  if (slot.span === "all" || slot.type === "break") {
    if (state.filters.search && !slotSearchText(slot).includes(state.filters.search)) return false;
    return true;
  }
  if (slot.type === "plenary") {
    if (state.filters.search && !slotSearchText(slot).includes(state.filters.search)) return false;
    if (state.filters.theme) return false;
    if (state.filters.room && !slot.rooms.includes(state.filters.room)) return false;
    return true;
  }
  return slot.sessions?.some(sessionMatchesFilters) ?? false;
}

function countVisibleSessions() {
  let count = 0;
  state.data?.slots?.forEach((slot) => {
    slot.sessions?.forEach((session) => {
      if (sessionMatchesFilters(session)) count++;
    });
  });
  return count;
}

function updateFilterStatus() {
  if (!els.filterStatus) return;
  if (!hasActiveFilters()) {
    els.filterStatus.textContent = "";
    els.filterStatus.classList.add("is-hidden");
    return;
  }
  els.filterStatus.textContent = formatFilterCount(state.lang, countVisibleSessions());
  els.filterStatus.classList.remove("is-hidden");
}

function getTheme(themeId) {
  return state.themeMap[themeId];
}

function hexToRgba(hex, alpha) {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function darkenHex(hex, amount = 0.2) {
  const h = hex.replace("#", "");
  const r = Math.max(0, Math.round(parseInt(h.slice(0, 2), 16) * (1 - amount)));
  const g = Math.max(0, Math.round(parseInt(h.slice(2, 4), 16) * (1 - amount)));
  const b = Math.max(0, Math.round(parseInt(h.slice(4, 6), 16) * (1 - amount)));
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

function getSlotIcon(slot) {
  return SLOT_ICONS[slot.id] || "";
}

function formatTimeCellHtml(slot) {
  return `${CLOCK_SVG}<span>${slot.start}</span><span>${slot.end}</span>`;
}

function buildBreakLabel(slot) {
  const icon = getSlotIcon(slot);
  const title = getSlotTitle(slot, state.lang);
  return icon
    ? `<span class="program-grid__slot-icon" aria-hidden="true">${icon}</span><span>${title}</span>`
    : title;
}

function buildSessionTooltip(title, time, rooms, themeLabel) {
  return `${time} · ${rooms}${themeLabel ? ` · ${themeLabel}` : ""}`;
}

function buildSessionHTML(session, slot) {
  const theme = getTheme(session.theme);
  const color = theme?.color || "#94a3b8";
  const colorDark = darkenHex(color, 0.22);
  const short = getThemeShort(session.theme, state.lang);
  const title = getSessionTitle(session, state.lang);
  const time = `${slot.start} – ${slot.end}`;
  const rooms = session.rooms.join(", ");
  const themeLabel = getThemeLabel(session.theme, state.lang);
  const eventDate = state.data?.event?.date || "";
  const ariaLabel = formatSessionAria(state.lang, title, time, rooms);
  const tooltip = buildSessionTooltip(title, time, rooms, themeLabel);
  return `
    <article
      class="session session--interactive"
      style="background:${hexToRgba(color, 0.06)};--tag-c1:${color};--tag-c2:${colorDark}"
      aria-label="${escapeAttr(ariaLabel)}"
      data-tooltip="${escapeAttr(tooltip)}"
      data-session-trigger
      data-session-title="${escapeAttr(title)}"
      data-session-time="${escapeAttr(time)}"
      data-session-start="${escapeAttr(slot.start)}"
      data-session-end="${escapeAttr(slot.end)}"
      data-session-date="${escapeAttr(eventDate)}"
      data-session-rooms="${escapeAttr(rooms)}"
      data-session-theme="${escapeAttr(themeLabel)}"
      data-session-theme-color="${color}"
      tabindex="0"
      role="button"
    >
      <span class="session__bar" style="background:${color}"></span>
      <div class="session__body">
        ${short ? `<span class="session__tag session__tag--gradient">${short}</span>` : ""}
        <span class="session__title">${title}</span>
      </div>
    </article>`;
}

function escapeAttr(str) {
  return String(str).replace(/"/g, "&quot;");
}

function buildRoomCellMap(slot) {
  const map = {};
  ROOMS.forEach((r) => {
    map[r] = null;
  });
  if (slot.sessions) {
    slot.sessions.forEach((session) => {
      session.rooms.forEach((room) => {
        map[room] = session;
      });
    });
  }
  return map;
}

function setGridColumns(grid, singleRoom) {
  grid.classList.toggle("program-grid--single-room", singleRoom);
}

function renderGrid() {
  const grid = els.grid;
  const headerGrid = els.gridHeader;
  if (!grid) return;

  grid.innerHTML = "";
  if (headerGrid) headerGrid.innerHTML = "";
  grid.setAttribute("aria-label", t("gridAria"));

  const onlyRoom = state.filters.room;
  const visibleRooms = onlyRoom ? [onlyRoom] : ROOMS;
  const roomCount = visibleRooms.length;
  const singleRoom = Boolean(onlyRoom);

  setGridColumns(grid, singleRoom);
  if (headerGrid) setGridColumns(headerGrid, singleRoom);

  if (headerGrid) {
    const corner = document.createElement("div");
    corner.className = "program-grid__cell program-grid__cell--corner";
    corner.setAttribute("role", "columnheader");
    corner.textContent = t("timeRoom");
    headerGrid.appendChild(corner);

    visibleRooms.forEach((room) => {
      const cell = document.createElement("div");
      cell.className = "program-grid__cell program-grid__cell--room";
      cell.setAttribute("role", "columnheader");
      cell.textContent = room;
      headerGrid.appendChild(cell);
    });
  }

  let visibleSlots = 0;

  state.data.slots.forEach((slot) => {
    const visible = slotHasVisibleContent(slot);
    if (!visible && hasActiveFilters()) return;
    visibleSlots++;

    const timeCell = document.createElement("div");
    timeCell.className = "program-grid__cell program-grid__cell--time";
    timeCell.setAttribute("role", "rowheader");
    timeCell.dataset.slotId = slot.id;
    timeCell.style.gridColumn = "1";
    timeCell.innerHTML = formatTimeCellHtml(slot);
    grid.appendChild(timeCell);

    if (slot.span === "all") {
      const cell = document.createElement("div");
      cell.className = "program-grid__cell program-grid__cell--break";
      cell.style.gridColumn = `2 / span ${roomCount}`;
      cell.dataset.slotId = slot.id;
      cell.innerHTML = buildBreakLabel(slot);
      grid.appendChild(cell);
      return;
    }

    if (slot.type === "plenary") {
      if (onlyRoom) {
        const cell = document.createElement("div");
        const inPlenary = slot.rooms.includes(onlyRoom);
        cell.className = inPlenary
          ? "program-grid__cell program-grid__cell--plenary"
          : "program-grid__cell program-grid__cell--empty";
        cell.style.gridColumn = "2";
        cell.dataset.slotId = slot.id;
        if (inPlenary) cell.innerHTML = buildBreakLabel(slot);
        grid.appendChild(cell);
        return;
      }

      const startIdx = ROOMS.indexOf(slot.rooms[0]) + 2;
      const endIdx = startIdx + slot.rooms.length;

      for (let col = 2; col < startIdx; col++) {
        const empty = document.createElement("div");
        empty.className = "program-grid__cell program-grid__cell--empty";
        empty.style.gridColumn = `${col}`;
        grid.appendChild(empty);
      }

      const cell = document.createElement("div");
      cell.className = "program-grid__cell program-grid__cell--plenary";
      cell.style.gridColumn = `${startIdx} / span ${slot.rooms.length}`;
      cell.dataset.slotId = slot.id;
      cell.innerHTML = buildBreakLabel(slot);
      grid.appendChild(cell);

      for (let col = endIdx; col <= ROOMS.length + 1; col++) {
        const empty = document.createElement("div");
        empty.className = "program-grid__cell program-grid__cell--empty";
        empty.style.gridColumn = `${col}`;
        grid.appendChild(empty);
      }
      return;
    }

    const roomMap = buildRoomCellMap(slot);
    const renderedSessions = new Set();

    visibleRooms.forEach((room, idx) => {
      const session = roomMap[room];
      const col = idx + 2;

      if (session && renderedSessions.has(session)) return;

      const cell = document.createElement("div");

      if (!session) {
        cell.className = "program-grid__cell program-grid__cell--empty";
        cell.style.gridColumn = `${col}`;
        grid.appendChild(cell);
        return;
      }

      renderedSessions.add(session);
      const span = onlyRoom ? 1 : Math.max(session.rooms.length, 1);
      const matches = sessionMatchesFilters(session);

      if (hasActiveFilters() && !matches) {
        cell.className = "program-grid__cell program-grid__cell--empty";
        cell.style.gridColumn = `${col} / span ${span}`;
        cell.dataset.slotId = slot.id;
        grid.appendChild(cell);
        return;
      }

      cell.className = "program-grid__cell program-grid__cell--session";
      cell.style.gridColumn = `${col} / span ${span}`;
      cell.dataset.slotId = slot.id;
      if (!matches) cell.classList.add("is-dimmed");
      cell.innerHTML = buildSessionHTML(session, slot);
      grid.appendChild(cell);
    });
  });

  const compactGrid = hasActiveFilters() && visibleSlots > 0 && visibleSlots <= 2;
  grid.classList.toggle("program-grid--few-rows", compactGrid);
  grid.classList.toggle("program-grid--single-row", hasActiveFilters() && visibleSlots === 1);
  if (compactGrid) {
    grid.style.setProperty("--visible-rows", String(visibleSlots));
  } else {
    grid.style.removeProperty("--visible-rows");
  }

  els.empty.classList.toggle("is-hidden", visibleSlots > 0);
}

function renderMobile() {
  const container = els.mobile;
  container.setAttribute("aria-label", t("mobileAria"));
  container.innerHTML = "";

  let visibleSlots = 0;

  state.data.slots.forEach((slot) => {
    if (!slotHasVisibleContent(slot) && hasActiveFilters()) return;

    const block = document.createElement("article");
    block.className = "time-block";
    block.dataset.slotId = slot.id;

    const header = document.createElement("header");
    header.className = "time-block__header";
    header.innerHTML = `<span class="time-block__time">${formatTimeRange(slot.start, slot.end)}</span>`;
    block.appendChild(header);

    const body = document.createElement("div");
    body.className = "time-block__body";

    if (slot.span === "all" || slot.type === "break") {
      visibleSlots++;
      const card = document.createElement("article");
      card.className = "mobile-card mobile-card--break";
      card.innerHTML = `<div class="mobile-card__content">${getSlotTitle(slot, state.lang)}</div>`;
      body.appendChild(card);
    } else if (slot.type === "plenary") {
      visibleSlots++;
      const card = document.createElement("article");
      card.className = "mobile-card mobile-card--break";
      card.innerHTML = `
        <div class="mobile-card__content">
          <p class="mobile-card__meta"><span class="mobile-card__room">${slot.rooms.join(", ")}</span></p>
          <h3 class="mobile-card__title">${getSlotTitle(slot, state.lang)}</h3>
        </div>`;
      body.appendChild(card);
    } else {
      let count = 0;
      slot.sessions.forEach((session) => {
        if (!sessionMatchesFilters(session)) return;
        count++;
        const theme = getTheme(session.theme);
        const color = theme?.color || "#94a3b8";
        const title = getSessionTitle(session, state.lang);
        const time = formatTimeRange(slot.start, slot.end);
        const rooms = session.rooms.join(", ");
        const ariaLabel = formatSessionAria(state.lang, title, time, rooms);
        const card = document.createElement("article");
        card.className = "mobile-card mobile-card--interactive";
        card.setAttribute("aria-label", ariaLabel);
        card.setAttribute("data-session-trigger", "");
        card.dataset.sessionTitle = title;
        card.dataset.sessionTime = time;
        card.dataset.sessionStart = slot.start;
        card.dataset.sessionEnd = slot.end;
        card.dataset.sessionDate = state.data?.event?.date || "";
        card.dataset.sessionRooms = session.rooms.join(", ");
        const themeLabel = getThemeLabel(session.theme, state.lang);
        const themeShort = getThemeShort(session.theme, state.lang) || themeLabel;
        const colorDark = darkenHex(color, 0.22);
        card.style.setProperty("--card-accent", color);
        card.dataset.sessionTheme = themeLabel;
        card.dataset.sessionThemeColor = color;
        card.setAttribute("tabindex", "0");
        card.setAttribute("role", "button");
        card.innerHTML = `
          <span class="mobile-card__bar" style="background:${color}"></span>
          <div class="mobile-card__content">
            <p class="mobile-card__meta">
              <span class="mobile-card__room">${session.rooms.join(", ")}</span>
              <span class="session__tag session__tag--gradient mobile-card__theme" style="--tag-c1:${color};--tag-c2:${colorDark}">${themeShort}</span>
            </p>
            <h3 class="mobile-card__title">${title}</h3>
          </div>`;
        body.appendChild(card);
      });
      if (count === 0) return;
      visibleSlots++;
    }

    block.appendChild(body);
    container.appendChild(block);
  });

  els.empty.classList.toggle("is-hidden", visibleSlots > 0);
}

function hasActiveFilters() {
  return Boolean(state.filters.room || state.filters.theme || state.filters.search);
}

function render() {
  if (DESKTOP_MQ.matches) {
    renderGrid();
    els.mobile.innerHTML = "";
  } else {
    renderMobile();
    els.grid.innerHTML = "";
    if (els.gridHeader) els.gridHeader.innerHTML = "";
  }
  updateFilterStatus();
  effects?.afterRender();
}

function renderWithFx() {
  effects?.beforeFilterRender?.();
  render();
  effects?.animateFilterChange();
}

init();
