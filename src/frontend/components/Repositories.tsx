import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import { RepositoryContainer } from '../atoms/RepositoryContainer';
import { RepositoryItem } from '../atoms/RepositoryItem';
import { RepositoryName } from '../atoms/RepositoryName';
import { usePaginatedRepositories } from '../state/use-paginated-repositories';
import { ArrowLeftIcon, ArrowRightIcon, RepoIcon, StarIcon } from '@primer/octicons-react';
import ReactTimeAgo from 'react-timeago';
import { stringify } from 'querystring';
import { RepositoryTitle } from '../atoms/RepositoryTitle';
import { LanguageColor } from '../atoms/LanguageColor';
import { RepositoryStatistic } from '../atoms/RepositoryStatistic';
import { RepositoryIconRow } from '../atoms/RepositoryIconRow';
import { PaginationContainer } from '../atoms/PaginationContainer';

export const Repositories: FC = () => {
  const { page, nextPage, prevPage, isLoading, isError, resolvedData, isFetching } = usePaginatedRepositories();

  return (
    <>
      <PaginationContainer>
        <RepositoryTitle>Repositories</RepositoryTitle>
        <Link to={prevPage}>
          <ArrowLeftIcon size={20} />
        </Link>
        <Link to={nextPage}>
          <ArrowRightIcon size={20} />
        </Link>
      </PaginationContainer>
      <RepositoryContainer $isFetching={isFetching}>
        {isLoading ? (
          <div>Loading...</div>
        ) : isError ? (
          <div>Error</div>
        ) : (
          <div>
            {resolvedData
              ? resolvedData.repos.map((repo) => (
                  <RepositoryItem
                    as={Link}
                    to={`/dashboard/info/${repo.full_name}?${stringify({ page })}`}
                    key={repo.id}
                  >
                    <RepositoryName>
                      <RepoIcon /> {repo.full_name}
                    </RepositoryName>
                    <RepositoryIconRow>
                      {repo.language ? (
                        <RepositoryStatistic>
                          <LanguageColor $language={repo.language as any} /> {repo.language}
                        </RepositoryStatistic>
                      ) : null}
                      {repo.stargazers_count ? (
                        <RepositoryStatistic>
                          <StarIcon />
                          {repo.stargazers_count}
                        </RepositoryStatistic>
                      ) : null}
                      {repo.updated_at ? (
                        <RepositoryStatistic>
                          Updated <ReactTimeAgo date={repo.updated_at}>{repo.updated_at}</ReactTimeAgo>
                        </RepositoryStatistic>
                      ) : null}
                    </RepositoryIconRow>
                  </RepositoryItem>
                ))
              : null}
          </div>
        )}
      </RepositoryContainer>
      <PaginationContainer>
        <Link to={prevPage}>
          <ArrowLeftIcon size={20} />
        </Link>
        <Link to={nextPage}>
          <ArrowRightIcon size={20} />
        </Link>
      </PaginationContainer>
    </>
  );
};
