const bnDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
const enDigits: Record<string, string> = {
  "০": "0", "১": "1", "২": "2", "৩": "3", "৪": "4",
  "৫": "5", "৬": "6", "৭": "7", "৮": "8", "৯": "9"
};

const bnDays = [
  "রবিবার", "সোমবার", "মঙ্গলবার", "বুধবার", "বৃহস্পতিবার", "শুক্রবার", "শনিবার"
];

const bnMonths = [
  "জানুয়ারি", "ফেব্রুয়ারি", "মার্চ", "এপ্রিল", "মে", "জুন",
  "জুলাই", "আগস্ট", "সেপ্টেম্বর", "অক্টোবর", "নভেম্বর", "ডিসেম্বর"
];

/**
 * Converts English numbers or numeric strings to Bengali digits with comma formatting
 */
export function toBnDigits(val: number | string | undefined | null): string {
  if (val === undefined || val === null) return "০";
  const numStr = typeof val === "number" ? val.toLocaleString("en-US") : val.toString();
  return numStr.replace(/\d/g, (d) => bnDigits[parseInt(d, 10)]);
}

/**
 * Converts Bengali digit string to regular JavaScript number
 */
export function parseBnDigits(str: string): number {
  if (!str) return 0;
  const enStr = str.replace(/[০-৯]/g, (ch) => enDigits[ch] || ch).replace(/,/g, "");
  const num = parseFloat(enStr);
  return isNaN(num) ? 0 : num;
}

/**
 * Formats price in Bengali (e.g. "১৪৮ টাকা")
 */
export function formatBnPrice(price: number | undefined | null): string {
  return `${toBnDigits(price)} টাকা`;
}

/**
 * Formats unit in Bengali (e.g. "প্রতি কেজি", "প্রতি লিটার")
 */
export function formatBnUnit(unit: string | undefined): string {
  if (!unit) return "প্রতি একক";
  const lower = unit.toLowerCase();
  switch (lower) {
    case "kg":
      return "প্রতি কেজি";
    case "liter":
    case "ltr":
      return "প্রতি লিটার";
    case "dozen":
      return "প্রতি ডজন";
    case "piece":
    case "pc":
      return "প্রতি পিস";
    case "gram":
    case "gm":
      return "প্রতি গ্রাম";
    default:
      return `প্রতি ${unit}`;
  }
}

/**
 * Formats percentage change with sign (e.g. "▲ ২.১%", "▼ ২.৯%", "— ০.০%")
 */
export function formatBnChange(dir: "up" | "down" | "flat", pct: number) {
  const absPct = Math.abs(pct).toFixed(1);
  const bnPct = toBnDigits(absPct);
  if (dir === "up") {
    return {
      text: `▲ ${bnPct}%`,
      symbol: "▲",
      colorClass: "bg-rose-50 text-rose-600 border-rose-200",
      textColor: "text-rose-600",
      bgColor: "bg-rose-50",
    };
  } else if (dir === "down") {
    return {
      text: `▼ ${bnPct}%`,
      symbol: "▼",
      colorClass: "bg-emerald-50 text-emerald-600 border-emerald-200",
      textColor: "text-emerald-600",
      bgColor: "bg-emerald-50",
    };
  } else {
    return {
      text: `— ${bnPct}%`,
      symbol: "—",
      colorClass: "bg-slate-100 text-slate-600 border-slate-200",
      textColor: "text-slate-600",
      bgColor: "bg-slate-100",
    };
  }
}

/**
 * Formats a Date object or current date to Bengali format (e.g. "মঙ্গলবার, ৬ অক্টোবর, ২০২৬")
 */
export function formatBnDate(date: Date = new Date()): string {
  const dayName = bnDays[date.getDay()];
  const dateNum = toBnDigits(date.getDate());
  const monthName = bnMonths[date.getMonth()];
  const yearNum = toBnDigits(date.getFullYear());
  return `${dayName}, ${dateNum} ${monthName}, ${yearNum}`;
}
