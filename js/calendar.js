const TZ = "Europe/Prague";

function compactDateTime(date, time) {
  const [y, m, d] = date.split("-");
  const [hh, mm] = time.split(":");
  return `${y}${m}${d}T${hh}${mm}00`;
}

function isoLocal(date, time) {
  return `${date}T${time}:00`;
}

function escapeIcs(text) {
  return String(text || "")
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n");
}

export function buildGoogleCalendarUrl({ title, start, end, date, location, description }) {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    dates: `${compactDateTime(date, start)}/${compactDateTime(date, end)}`,
    details: description || "",
    location: location || "",
    ctz: TZ,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function buildOutlookCalendarUrl({ title, start, end, date, location, description }) {
  const params = new URLSearchParams({
    path: "/calendar/action/compose",
    rru: "addevent",
    subject: title,
    startdt: isoLocal(date, start),
    enddt: isoLocal(date, end),
    body: description || "",
    location: location || "",
  });
  return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`;
}

export function buildIcsBlob({ title, start, end, date, location, description, uid }) {
  const stamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//CEEDUCON//Program//CS",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${stamp}`,
    `DTSTART:${compactDateTime(date, start)}`,
    `DTEND:${compactDateTime(date, end)}`,
    `SUMMARY:${escapeIcs(title)}`,
    description ? `DESCRIPTION:${escapeIcs(description)}` : null,
    location ? `LOCATION:${escapeIcs(location)}` : null,
    "END:VEVENT",
    "END:VCALENDAR",
  ]
    .filter(Boolean)
    .join("\r\n");

  return new Blob([ics], { type: "text/calendar;charset=utf-8" });
}

export function downloadIcsFile(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.rel = "noopener";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
