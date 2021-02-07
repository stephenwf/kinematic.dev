import React, { FC, useCallback } from 'react';
import { useRecoilValue } from 'recoil';
import { useQuery } from 'react-query';
import { defaultConfig } from '../config/default-react-query';
import { Tree } from '../components/Tree';
import styled from 'styled-components';
import { RepositoryTitle } from '../atoms/RepositoryTitle';
import { PaginationContainer } from '../atoms/PaginationContainer';
import { currentWorkspaceId, useOpenFile } from '../state/workspace';

const FileBrowserContainer = styled.div`
  margin: 1em;
  padding: 1em;
  border-right: 1px solid #eee;
`;

export const FileBrowser: FC = () => {
  const workspace = useRecoilValue(currentWorkspaceId);
  const openFile = useOpenFile();

  const { data } = useQuery(
    ['repo', { workspace }],
    async () => {
      return fetch(`/api/tree/${workspace}`).then((r) => r.json());
    },
    defaultConfig
  );

  const onChangeItem = useCallback((item: any) => {
    // console.log(item);
    // No-op, do something eventually with this.
  }, []);

  const onOpenItem = useCallback(
    (item: any) => {
      // New state.
      openFile({
        path: item.id,
        sha: item.sha,
        name: item.name,
      });
    },
    [openFile]
  );

  return (
    <>
      <PaginationContainer>
        <RepositoryTitle>All files</RepositoryTitle>
      </PaginationContainer>
      <FileBrowserContainer>
        {data ? <Tree tree={data} onChangeItem={onChangeItem} onOpenItem={onOpenItem} /> : null}
      </FileBrowserContainer>
    </>
  );
};
