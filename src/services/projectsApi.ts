import type {
  get200AdminProjectsResponseJson,
  post201AdminProjectsResponseJson,
  postAdminProjectsRequestBodyJson
} from '@/share/utils/api/__generated__/types';
import { clientRequest } from '@/share/utils/api/clientRequest';

export const projectsApi = {
  async getProjects() {
    const { data } = await clientRequest.GET('/admin/projects');
    const payload = data as get200AdminProjectsResponseJson | undefined;
    return payload?.projects ?? [];
  },

  async createProject(body: postAdminProjectsRequestBodyJson) {
    const { data } = await clientRequest.POST('/admin/projects', {
      body
    });

    return data as post201AdminProjectsResponseJson;
  }
};
