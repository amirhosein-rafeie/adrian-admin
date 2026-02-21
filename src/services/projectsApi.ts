import type { get200AdminProjectsResponseJson, post201AdminProjectsResponseJson, postAdminProjectsRequestBodyJson } from '@/share/utils/api/__generated__/types';

const API_BASE_URL = '';

const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem('access_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const parseError = async (response: Response) => {
  try {
    const data = await response.json();
    return data?.error ?? 'خطا در ارتباط با سرور';
  } catch {
    return 'خطا در ارتباط با سرور';
  }
};

export const projectsApi = {
  async getProjects() {
    const response = await fetch(`${API_BASE_URL}/admin/projects`, {
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error(await parseError(response));
    }

    const payload = (await response.json()) as get200AdminProjectsResponseJson;
    return payload.projects ?? [];
  },

  async createProject(body: postAdminProjectsRequestBodyJson) {
    const response = await fetch(`${API_BASE_URL}/admin/projects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      throw new Error(await parseError(response));
    }

    return (await response.json()) as post201AdminProjectsResponseJson;
  }
};
