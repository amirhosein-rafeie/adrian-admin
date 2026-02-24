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
