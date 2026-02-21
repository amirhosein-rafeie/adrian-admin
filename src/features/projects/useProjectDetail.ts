import { useQuery } from '@tanstack/react-query';
import { PROJECT_DETAIL } from '@/share/constants';
import { clientRequest } from '@/share/utils/api/clientRequest';

export const useProjectDetail = (id: number) => {
  const { data, isPending, isError } = useQuery({
    queryKey: [PROJECT_DETAIL, id],
    enabled: Number.isFinite(id),
    queryFn: () =>
      clientRequest.GET('/admin/projects/{id}', {
        params: {
          path: { id }
        }
      })
  });

  return {
    data,
    isPending,
    isError
  };
};
