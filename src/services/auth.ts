const TOKEN_COOKIE_KEY = 'access_token';

const getCookieValue = (name: string) => {
  const cookie = document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${name}=`));

  return cookie ? decodeURIComponent(cookie.split('=')[1]) : '';
};

export const auth = {
  tokenCookieKey: TOKEN_COOKIE_KEY,
  getToken() {
    return getCookieValue(TOKEN_COOKIE_KEY);
  },
  isAuthenticated() {
    return Boolean(getCookieValue(TOKEN_COOKIE_KEY));
  },
  setToken(token: string) {
    document.cookie = `${TOKEN_COOKIE_KEY}=${encodeURIComponent(token)}; Path=/; SameSite=Lax`;
  },
  clearToken() {
    document.cookie = `${TOKEN_COOKIE_KEY}=; Max-Age=0; Path=/; SameSite=Lax`;
  }
};
