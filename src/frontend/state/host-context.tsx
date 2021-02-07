import React, { useContext, useEffect, useMemo } from 'react';
import { Host, KinematicHostConfig } from '../../protocol/kinematic-host';
import { useQuery } from 'react-query';
import { defaultConfig } from '../config/default-react-query';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { currentFile, currentRepository, currentRepositoryBranch } from './workspace';
import { useHistory } from 'react-router';

export type HostContext = {
  // nothing yet.
  host?: Host;
  viewers: Array<{
    path: string;
    loader: string;
  }>;
};

export const ReactKinematicHostContext = React.createContext<HostContext>({
  viewers: [],
});

export const KinematicProvider: React.FC<{
  user: string;
  repo: string;
  branch: string;
  config?: KinematicHostConfig;
}> = ({ branch, repo, user, config, children }) => {
  const projectId = `${user}/${repo}/${branch}`;

  const setCurrentRepository = useSetRecoilState(currentRepository);
  const setCurrentBranch = useSetRecoilState(currentRepositoryBranch);
  const _currentFile = useRecoilValue(currentFile);
  const history = useHistory();

  useEffect(() => {
    if (_currentFile) {
      history.push({
        pathname: history.location.pathname,
        search: _currentFile ? `?file=${_currentFile.path}` : undefined,
      });
    }
  }, [_currentFile, history]);

  useEffect(() => {
    setCurrentRepository(`${user}/${repo}`);
  }, [repo, setCurrentRepository, user]);

  useEffect(() => {
    setCurrentBranch(branch);
  }, [branch, setCurrentBranch]);

  const { data } = useQuery(
    ['config', { repo, user, branch }],
    async () => {
      return fetch(`/api/config/${user}/${repo}/${branch}`).then((r) => r.json());
    },
    defaultConfig
  );

  const value = useMemo(() => {
    return {
      host: new Host(projectId, config || {}),
      viewers: data ? data?.viewers : [],
    };
  }, [projectId, config, data]);

  if (!data) {
    return <>Loading...</>;
  }

  return <ReactKinematicHostContext.Provider value={value}>{children}</ReactKinematicHostContext.Provider>;
};

export function useKinematicHost() {
  const { host } = useContext(ReactKinematicHostContext);

  if (!host) {
    throw new Error('No host');
  }

  return host;
}

export function useKinematic() {
  return useContext(ReactKinematicHostContext);
}
