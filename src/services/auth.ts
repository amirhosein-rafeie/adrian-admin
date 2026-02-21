import { TOKEN } from '@/share/constants';

const getCookieValue = (name: string) => {
  const cookie = document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${name}=`));

  return cookie ? decodeURIComponent(cookie.split('=')[1]) : '';
};

export const auth = {
  tokenCookieKey: TOKEN,
  getToken() {
    return getCookieValue(TOKEN);
  },
  isAuthenticated() {
    return Boolean(getCookieValue(TOKEN));
  },
  setToken(token: string) {
    document.cookie = `${TOKEN}=${encodeURIComponent(token)}; Path=/; SameSite=Lax`;
  },
  clearToken() {
    document.cookie = `${TOKEN}=; Max-Age=0; Path=/; SameSite=Lax`;
  }
};
