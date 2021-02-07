import { useQuery } from 'react-query';
import { Repository } from '../../types/schemas/repository';

export function useRepository(user: string, repo: string) {
  return useQuery(
    [
      'get-repo',
      {
        user: user,
        repo: repo,
      },
    ],
    async () => {
      return fetch(`/api/repos/${user}/${repo}`).then((r) => r.json()) as Promise<Repository>;
    }
  );
}
