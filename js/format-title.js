export function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function formatSessionTitleHTML(title) {
  const colonIdx = title.indexOf(":");
  if (colonIdx === -1) {
    return `<span class="session__title-name session__title-name--solo">${escapeHtml(title)}</span>`;
  }
  const name = title.slice(0, colonIdx).trim();
  const desc = title.slice(colonIdx + 1).trim();
  if (!desc) {
    return `<span class="session__title-name">${escapeHtml(name)}:</span>`;
  }
  return `<span class="session__title-name">${escapeHtml(name)}:</span><span class="session__title-desc">${escapeHtml(desc)}</span>`;
}
