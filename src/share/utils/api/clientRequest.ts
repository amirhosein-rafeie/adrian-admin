import { TOKEN } from '@/share/constants';
import { deleteCookie, getCookie } from 'cookies-next';
import type { Middleware } from 'openapi-fetch';
import createClient from 'openapi-fetch';
import { paths } from './__generated__/custom';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const clientRequest = createClient<paths>({
  baseUrl: BASE_URL,
});

export interface ApiErrorBody {
  error?: {
    code?: string;
    reason?: string;
  };
  code?: string;
  reason?: string;
  message?: string;
  [key: string]: unknown;
}

export interface ApiError extends Error {
  status?: number;
  details?: ApiErrorBody;
}

const myMiddleware: Middleware = {
  async onRequest({ request }) {
    const token = getCookie(TOKEN);
    if (token) request.headers.set('authorization', `Bearer ${token}`);
    return request;
  },

  async onResponse({ response, request }) {
    if (response.status === 401) {
      deleteCookie(TOKEN);
      console.log(
        `TOKEN is removed because of 401 status code in ${request?.url} request`
      );
    }

    if (!response.ok) {
      let errorBody: ApiErrorBody = {};
      try {
        errorBody = await response.json();
      } catch {
        errorBody = { message: response.statusText };
      }

      const error: ApiError = new Error(
        errorBody?.error?.code || errorBody?.code || errorBody?.message || ''
      );
      error.status = response.status;
      error.details = errorBody;

      throw error;
    }

    return response;
  },
};

clientRequest.use(myMiddleware);
