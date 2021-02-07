import { usePaginatedQuery } from 'react-query';
import { Repository } from '../../types/schemas/repository';
import { defaultConfig } from '../config/default-react-query';
import { useLocation } from 'react-router-dom';
import { useLocationQuery } from './use-location-query';
import { stringify } from 'querystring';

export function usePaginatedRepositories() {
  const location = useLocation();
  const query = useLocationQuery();
  const page = query.page ? Number(query.page) : 1;
  const { isLoading, isError, resolvedData, latestData, isFetching } = usePaginatedQuery(
    ['api/repos', page],
    async (key, pageNumber: number) => {
      return fetch(`/api/repos?page=${pageNumber}`).then((r) => r.json()) as Promise<{ repos: Repository[] }>;
    },
    defaultConfig
  );

  const prevPage = `${location.pathname}?${stringify({ page: Math.max(page - 1, 1) })}`;
  const nextPage = `${location.pathname}?${stringify({ page: !latestData ? page : page + 1 })}`;

  return {
    isLoading,
    isError,
    isFetching,
    latestData,
    resolvedData,
    page,
    nextPage,
    prevPage,
  };
}
