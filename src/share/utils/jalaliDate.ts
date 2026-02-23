const PERSIAN_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

const toEnglishDigits = (value: string) => value.replace(/[۰-۹]/g, (char) => String(PERSIAN_DIGITS.indexOf(char)));

export const toPersianDigits = (value: string) => value.replace(/\d/g, (digit) => PERSIAN_DIGITS[Number(digit)] ?? digit);

const div = (a: number, b: number) => Math.floor(a / b);

const jalCal = (jy: number) => {
  const breaks = [-61, 9, 38, 199, 426, 686, 756, 818, 1111, 1181, 1210, 1635, 2060, 2097, 2192, 2262, 2324, 2394, 2456, 3178];
  const bl = breaks.length;
  const gy = jy + 621;
  let leapJ = -14;
  let jp = breaks[0];
  let jump = 0;

  if (jy < jp || jy >= breaks[bl - 1]) throw new Error('Invalid Jalali year');

  for (let i = 1; i < bl; i += 1) {
    const jm = breaks[i];
    jump = jm - jp;
    if (jy < jm) break;
    leapJ += div(jump, 33) * 8 + div((jump % 33), 4);
    jp = jm;
  }

  let n = jy - jp;
  leapJ += div(n, 33) * 8 + div((n % 33) + 3, 4);
  if ((jump % 33) === 4 && jump - n === 4) leapJ += 1;

  const leapG = div(gy, 4) - div((div(gy, 100) + 1) * 3, 4) - 150;
  const march = 20 + leapJ - leapG;

  if (jump - n < 6) n = n - jump + div(jump + 4, 33) * 33;
  let leap = (((n + 1) % 33) - 1) % 4;
  if (leap === -1) leap = 4;

  return { leap, gy, march };
};

const g2d = (gy: number, gm: number, gd: number) => {
  let d = div((gy + div(gm - 8, 6) + 100100) * 1461, 4);
  d += div(153 * ((gm + 9) % 12) + 2, 5) + gd - 34840408;
  d -= div(div(gy + 100100 + div(gm - 8, 6), 100) * 3, 4);
  return d;
};

const d2g = (jdn: number) => {
  let j = 4 * jdn + 139361631;
  j += div(div(4 * jdn + 183187720, 146097) * 3, 4) * 4 - 3908;
  const i = div((j % 1461), 4) * 5 + 308;
  const gd = div((i % 153), 5) + 1;
  const gm = (div(i, 153) % 12) + 1;
  const gy = div(j, 1461) - 100100 + div(8 - gm, 6);
  return { gy, gm, gd };
};

const j2d = (jy: number, jm: number, jd: number) => {
  const r = jalCal(jy);
  return g2d(r.gy, 3, r.march) + (jm - 1) * 31 - div(jm, 7) * (jm - 7) + jd - 1;
};

const d2j = (jdn: number) => {
  const g = d2g(jdn);
  let jy = g.gy - 621;
  const r = jalCal(jy);
  const jdn1f = g2d(g.gy, 3, r.march);
  let jd;
  let jm;
  let k = jdn - jdn1f;

  if (k >= 0) {
    if (k <= 185) {
      jm = 1 + div(k, 31);
      jd = (k % 31) + 1;
      return { jy, jm, jd };
    }
    k -= 186;
  } else {
    jy -= 1;
    k += 179;
    if (r.leap === 1) k += 1;
  }

  jm = 7 + div(k, 30);
  jd = (k % 30) + 1;
  return { jy, jm, jd };
};

const pad = (value: number) => String(value).padStart(2, '0');

export const normalizeJalaliDateInput = (value: string) => toEnglishDigits(value).replace(/-/g, '/').trim();

export const jalaliToGregorian = (value: string) => {
  const normalized = normalizeJalaliDateInput(value);
  const match = normalized.match(/^(\d{4})\/(\d{1,2})\/(\d{1,2})$/);
  if (!match) return '';

  const jy = Number(match[1]);
  const jm = Number(match[2]);
  const jd = Number(match[3]);
  if (jm < 1 || jm > 12 || jd < 1 || jd > 31) return '';

  const { gy, gm, gd } = d2g(j2d(jy, jm, jd));
  return `${gy}-${pad(gm)}-${pad(gd)}`;
};

export const gregorianToJalali = (value?: string | null) => {
  if (!value) return '';
  const normalized = value.length >= 10 ? value.slice(0, 10) : value;
  const match = normalized.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})$/);
  if (!match) return '';

  const gy = Number(match[1]);
  const gm = Number(match[2]);
  const gd = Number(match[3]);
  const j = d2j(g2d(gy, gm, gd));

  return `${j.jy}/${pad(j.jm)}/${pad(j.jd)}`;
};
