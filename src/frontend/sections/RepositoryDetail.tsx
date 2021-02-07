import React, { FC } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useRepository } from '../state/use-repository';
import { font } from '../variables';
import { stringify } from 'querystring';
import { RepositoryName } from '../atoms/RepositoryName';
import { RepoIcon, StarIcon } from '@primer/octicons-react';
import { RepositoryIconRow } from '../atoms/RepositoryIconRow';
import { LanguageColor } from '../atoms/LanguageColor';
import ReactTimeAgo from 'react-timeago';
import { RepositoryItem } from '../atoms/RepositoryItem';
import { RepositoryStatistic } from '../atoms/RepositoryStatistic';

export const RepositoryDetail: FC = () => {
  const params = useParams<{ user: string; repo: string }>();

  const { data: repo } = useRepository(params.user, params.repo);

  return (
    <div>
      <div style={{ border: '1px solid #ddd', borderRadius: 5, padding: '1em', margin: '.8em' }}>
        <RepositoryItem $interactive={false}>
          <RepositoryName>
            {params.user}/{params.repo}
          </RepositoryName>
          {repo ? (
            <>
              <p>{repo.description}</p>
              <RepositoryIconRow style={{ marginLeft: 0 }}>
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
            </>
          ) : null}
        </RepositoryItem>

        {repo ? (
          <button style={{ background: '#506ED5', color: '#fff', padding: '1em 1.5em', border: 'none' }}>
            <Link
              to={`/browse/${repo.full_name}/${repo.default_branch}`}
              style={{ color: '#fff', textDecoration: 'none' }}
            >
              Open in Kinematic
            </Link>
          </button>
        ) : null}
      </div>
    </div>
  );
};
