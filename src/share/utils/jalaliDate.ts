import moment from 'moment-jalaali';

const JALALI_FORMAT = 'jYYYY/jMM/jDD';
const GREGORIAN_FORMAT = 'YYYY-MM-DD';
const PERSIAN_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

const toEnglishDigits = (value: string) => value.replace(/[۰-۹]/g, (char) => String(PERSIAN_DIGITS.indexOf(char)));

export const normalizeJalaliDateInput = (value: string) => toEnglishDigits(value).replace(/-/g, '/').trim();

export const jalaliToGregorian = (value: string) => {
  const normalized = normalizeJalaliDateInput(value);
  const parsed = moment(normalized, JALALI_FORMAT, true);
  if (!parsed.isValid()) return '';
  return parsed.format(GREGORIAN_FORMAT);
};

export const gregorianToJalali = (value?: string | null) => {
  if (!value) return '';
  const normalized = value.length >= 10 ? value.slice(0, 10) : value;
  const parsed = moment(normalized, ['YYYY-MM-DD', 'YYYY/M/D', 'YYYY/MM/DD'], true);
  if (!parsed.isValid()) return '';
  return parsed.format(JALALI_FORMAT);
};

const hasTimePart = (value: string) => /T|\s\d{1,2}:\d{2}/.test(value);

export const formatDateToJalali = (value?: string | null, fallback = '—') => {
  if (!value) return fallback;

  const parsed = moment(value);
  if (!parsed.isValid()) return fallback;

  const format = hasTimePart(value) ? 'jYYYY/jMM/jDD HH:mm' : JALALI_FORMAT;
  return parsed.format(format);
};

export const isDateLikeField = (field: string) => /(?:^|_)(?:date|time|at|deadline)(?:$|_)/i.test(field);
