const ROOMS = ["C1", "C2", "C3", "D2", "D3+D4", "D6+D7", "E1", "E2"];

const state = {
  data: null,
  themeMap: {},
  filters: { room: "", theme: "" },
  liveMode: false,
  liveInterval: null,
};

const els = {
  legend: document.getElementById("legend"),
  grid: document.getElementById("program-grid"),
  mobile: document.getElementById("program-mobile"),
  empty: document.getElementById("program-empty"),
  filterRoom: document.getElementById("filter-room"),
  filterTheme: document.getElementById("filter-theme"),
  filterReset: document.getElementById("filter-reset"),
  liveToggle: document.getElementById("live-toggle"),
  printBtn: document.getElementById("print-btn"),
};

async function init() {
  const response = await fetch("data/program.json");
  state.data = await response.json();
  state.themeMap = Object.fromEntries(state.data.themes.map((t) => [t.id, t]));
  populateFilters();
  renderLegend();
  render();
  bindEvents();
}

function populateFilters() {
  ROOMS.forEach((room) => {
    const opt = document.createElement("option");
    opt.value = room;
    opt.textContent = room;
    els.filterRoom.appendChild(opt);
  });

  state.data.themes.forEach((theme) => {
    const opt = document.createElement("option");
    opt.value = theme.id;
    opt.textContent = theme.label;
    els.filterTheme.appendChild(opt);
  });
}

function renderLegend() {
  els.legend.innerHTML = state.data.themes
    .map(
      (theme) => `
    <div class="legend__item">
      <span class="legend__bar" style="background:${theme.color}"></span>
      <span class="legend__label">${theme.label}</span>
    </div>`
    )
    .join("");
}

function bindEvents() {
  els.filterRoom.addEventListener("change", () => {
    state.filters.room = els.filterRoom.value;
    render();
  });

  els.filterTheme.addEventListener("change", () => {
    state.filters.theme = els.filterTheme.value;
    render();
  });

  els.filterReset.addEventListener("click", () => {
    state.filters = { room: "", theme: "" };
    els.filterRoom.value = "";
    els.filterTheme.value = "";
    render();
  });

  els.liveToggle.addEventListener("click", () => {
    state.liveMode = !state.liveMode;
    els.liveToggle.setAttribute("aria-pressed", String(state.liveMode));
    if (state.liveMode) {
      updateLiveHighlight();
      state.liveInterval = setInterval(updateLiveHighlight, 60000);
    } else {
      clearInterval(state.liveInterval);
      render();
    }
  });

  els.printBtn.addEventListener("click", () => window.print());
}

function formatTimeRange(start, end) {
  return `${start} – ${end}`;
}

function sessionMatchesFilters(session) {
  const { room, theme } = state.filters;
  if (theme && session.theme !== theme) return false;
  if (room && !session.rooms.includes(room)) return false;
  return true;
}

function slotHasVisibleContent(slot) {
  if (slot.span === "all" || slot.type === "break" || slot.type === "plenary") {
    if (!state.filters.room && !state.filters.theme) return true;
    if (slot.type === "break" || slot.span === "all") return !state.filters.theme;
    return sessionMatchesFilters({ rooms: slot.rooms || [], theme: null });
  }
  return slot.sessions?.some(sessionMatchesFilters) ?? false;
}

function isSlotLive(slot) {
  if (!state.data?.event?.date) return false;
  const now = new Date();
  const today = state.data.event.date;
  const start = new Date(`${today}T${slot.start}:00`);
  const end = new Date(`${today}T${slot.end}:00`);
  return now >= start && now < end;
}

function updateLiveHighlight() {
  document.querySelectorAll(".is-live").forEach((el) => el.classList.remove("is-live"));
  if (!state.liveMode) return;

  state.data.slots.forEach((slot, index) => {
    if (!isSlotLive(slot)) return;
    document
      .querySelectorAll(`[data-slot-id="${slot.id}"]`)
      .forEach((el) => el.classList.add("is-live"));
  });
}

function getThemeColor(themeId) {
  return state.themeMap[themeId]?.color || "transparent";
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

function renderGrid() {
  const grid = els.grid;
  grid.innerHTML = "";
  grid.style.gridTemplateColumns = `110px repeat(${ROOMS.length}, minmax(120px, 1fr))`;

  const corner = document.createElement("div");
  corner.className = "program-grid__cell program-grid__cell--corner";
  corner.setAttribute("role", "columnheader");
  corner.textContent = "TIME / ROOM";
  grid.appendChild(corner);

  ROOMS.forEach((room) => {
    const cell = document.createElement("div");
    cell.className = "program-grid__cell program-grid__cell--room";
    cell.setAttribute("role", "columnheader");
    cell.textContent = room;
    grid.appendChild(cell);
  });

  let visibleSlots = 0;

  state.data.slots.forEach((slot) => {
    const visible = slotHasVisibleContent(slot);
    if (!visible && (state.filters.room || state.filters.theme)) return;
    visibleSlots++;

    const timeCell = document.createElement("div");
    timeCell.className = "program-grid__cell program-grid__cell--time";
    timeCell.setAttribute("role", "rowheader");
    timeCell.dataset.slotId = slot.id;
    timeCell.innerHTML = `<span>${slot.start}</span><span>${slot.end}</span>`;
    if (state.liveMode && isSlotLive(slot)) timeCell.classList.add("is-live");
    grid.appendChild(timeCell);

    if (slot.span === "all") {
      const cell = document.createElement("div");
      cell.className = "program-grid__cell program-grid__cell--break";
      cell.style.gridColumn = `2 / span ${ROOMS.length}`;
      cell.dataset.slotId = slot.id;
      cell.textContent = slot.title;
      if (state.liveMode && isSlotLive(slot)) cell.classList.add("is-live");
      grid.appendChild(cell);
      return;
    }

    if (slot.type === "plenary") {
      const cell = document.createElement("div");
      cell.className = "program-grid__cell program-grid__cell--plenary";
      const startIdx = ROOMS.indexOf(slot.rooms[0]) + 2;
      const span = slot.rooms.length;
      cell.style.gridColumn = `${startIdx} / span ${span}`;
      cell.dataset.slotId = slot.id;
      cell.textContent = slot.title;
      if (state.liveMode && isSlotLive(slot)) cell.classList.add("is-live");
      grid.appendChild(cell);

      const emptyCount = ROOMS.length - slot.rooms.length;
      for (let i = 0; i < emptyCount; i++) {
        const empty = document.createElement("div");
        empty.className = "program-grid__cell program-grid__cell--empty";
        grid.appendChild(empty);
      }
      return;
    }

    const roomMap = buildRoomCellMap(slot);

    ROOMS.forEach((room) => {
      const session = roomMap[room];
      const cell = document.createElement("div");

      if (!session) {
        cell.className = "program-grid__cell program-grid__cell--empty";
        grid.appendChild(cell);
        return;
      }

      const matches = sessionMatchesFilters(session);
      cell.className = "program-grid__cell program-grid__cell--session";
      cell.dataset.slotId = slot.id;

      if (!matches) {
        cell.classList.add("is-dimmed");
      }
      if (state.filters.room || state.filters.theme) {
        if (!matches) cell.classList.add("is-hidden");
      }
      if (state.liveMode && isSlotLive(slot)) cell.classList.add("is-live");

      const themeColor = getThemeColor(session.theme);
      cell.innerHTML = `
        <article class="session">
          <span class="session__bar" style="background:${themeColor}"></span>
          <span class="session__title">${session.title}</span>
        </article>`;
      grid.appendChild(cell);
    });
  });

  els.empty.classList.toggle("is-hidden", visibleSlots > 0);
}

function renderMobile() {
  const container = els.mobile;
  container.innerHTML = "";

  let visibleSlots = 0;

  state.data.slots.forEach((slot) => {
    const block = document.createElement("article");
    block.className = "time-block";
    block.dataset.slotId = slot.id;

    if (state.liveMode && isSlotLive(slot)) block.classList.add("is-live");

    const header = document.createElement("header");
    header.className = "time-block__header";
    header.innerHTML = `
      <span class="time-block__time">${formatTimeRange(slot.start, slot.end)}</span>
      ${state.liveMode && isSlotLive(slot) ? '<span class="time-block__badge">Právě probíhá</span>' : ""}`;
    block.appendChild(header);

    const body = document.createElement("div");
    body.className = "time-block__body";

    if (slot.span === "all" || slot.type === "break") {
      if (!slotHasVisibleContent(slot) && (state.filters.room || state.filters.theme)) return;
      visibleSlots++;
      const card = document.createElement("div");
      card.className = "mobile-card mobile-card--break";
      card.innerHTML = `<div class="mobile-card__content">${slot.title}</div>`;
      body.appendChild(card);
    } else if (slot.type === "plenary") {
      if (!slotHasVisibleContent(slot) && state.filters.room) return;
      visibleSlots++;
      const card = document.createElement("div");
      card.className = "mobile-card mobile-card--break";
      card.innerHTML = `
        <div class="mobile-card__content">
          <p class="mobile-card__meta">${slot.rooms.join(", ")}</p>
          <h3 class="mobile-card__title">${slot.title}</h3>
        </div>`;
      body.appendChild(card);
    } else {
      let hasVisible = false;
      slot.sessions.forEach((session) => {
        const matches = sessionMatchesFilters(session);
        if (state.filters.room || state.filters.theme) {
          if (!matches) return;
        }
        hasVisible = true;
        const theme = state.themeMap[session.theme];
        const card = document.createElement("article");
        card.className = "mobile-card";
        if (!matches && (state.filters.room || state.filters.theme)) {
          card.classList.add("is-hidden");
        }
        card.innerHTML = `
          <span class="mobile-card__bar" style="background:${theme?.color || "#ccc"}"></span>
          <div class="mobile-card__content">
            <p class="mobile-card__meta">
              <span>${session.rooms.join(", ")}</span>
              ${theme ? `<span>${theme.label}</span>` : ""}
            </p>
            <h3 class="mobile-card__title">${session.title}</h3>
          </div>`;
        body.appendChild(card);
      });
      if (!hasVisible && (state.filters.room || state.filters.theme)) return;
      visibleSlots++;
    }

    block.appendChild(body);
    container.appendChild(block);
  });

  els.empty.classList.toggle("is-hidden", visibleSlots > 0);
}

function render() {
  renderGrid();
  renderMobile();
  if (state.liveMode) updateLiveHighlight();
}

init().catch((err) => {
  console.error("Failed to load program:", err);
  els.grid.innerHTML = "<p>Nepodařilo se načíst program. Spusťte stránku přes lokální server.</p>";
});
