import moment from 'moment-jalaali';

const PERSIAN_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

const toEnglishDigits = (value: string) => value.replace(/[۰-۹]/g, (char) => String(PERSIAN_DIGITS.indexOf(char)));

export const toPersianDigits = (value: string) => value.replace(/\d/g, (digit) => PERSIAN_DIGITS[Number(digit)] ?? digit);

export const normalizeJalaliDateInput = (value: string) => toEnglishDigits(value).replace(/-/g, '/').trim();

export const jalaliToGregorian = (value: string) => {
  const normalized = normalizeJalaliDateInput(value);
  if (!moment(normalized, 'jYYYY/jMM/jDD', true).isValid()) return '';
  return moment(normalized, 'jYYYY/jMM/jDD').format('YYYY-MM-DD');
};

export const gregorianToJalali = (value?: string | null) => {
  if (!value) return '';
  const normalized = value.length >= 10 ? value.slice(0, 10) : value;
  if (!moment(normalized, ['YYYY-MM-DD', 'YYYY/MM/DD'], true).isValid()) return '';
  return moment(normalized, ['YYYY-MM-DD', 'YYYY/MM/DD']).format('jYYYY/jMM/jDD');
};
