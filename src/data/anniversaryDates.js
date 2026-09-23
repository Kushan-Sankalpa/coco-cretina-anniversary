// Date-only values are interpreted at midnight in the visitor's local timezone.
// Feb 29 anniversaries fall on Feb 28 in a non-leap year. Never parse YYYY-MM-DD as UTC.
export function parseRelationshipDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value || "")) return null;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day ? date : null;
}

export function anniversaryDate(start, years) {
  const year = start.getFullYear() + years;
  const lastDay = new Date(year, start.getMonth() + 1, 0).getDate();
  return new Date(year, start.getMonth(), Math.min(start.getDate(), lastDay));
}

export function ordinal(number) {
  const lastTwo = number % 100;
  const suffix = lastTwo >= 11 && lastTwo <= 13 ? "th" : ({ 1: "st", 2: "nd", 3: "rd" }[number % 10] || "th");
  return `${number}${suffix}`;
}

export function getAnniversaryState(config, now = new Date()) {
  const start = parseRelationshipDate(config.relationshipStartDate);
  const celebration = config.currentAnniversaryNumber;
  const base = { configured: false, years: celebration, months: celebration * 12, nextNumber: celebration + 1, nextDate: null };
  if (!start || start > now) return base;
  let years = now.getFullYear() - start.getFullYear();
  if (anniversaryDate(start, years) > now) years--;
  let months = (now.getFullYear() - start.getFullYear()) * 12 + now.getMonth() - start.getMonth();
  const monthlyDay = Math.min(start.getDate(), new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate());
  if (now.getDate() < monthlyDay) months--;
  // This keeps the celebration's next chapter (5th) rather than counting down to
  // the current 4th when someone visits before its date. Later years roll forward.
  const nextNumber = Math.max(celebration + 1, years + 1);
  return { configured: true, years, months, nextNumber, nextDate: anniversaryDate(start, nextNumber) };
}

export function getCountdown(target, now = new Date()) {
  if (!target) return null;
  const seconds = Math.max(0, Math.floor((target - now) / 1000));
  return { days: Math.floor(seconds / 86400), hours: Math.floor(seconds / 3600) % 24, minutes: Math.floor(seconds / 60) % 60, seconds: seconds % 60 };
}
