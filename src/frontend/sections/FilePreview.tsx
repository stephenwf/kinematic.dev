import React, { FC, useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import { Tabs } from '../components/Tabs';
import { ViewFile } from './ViewFile';
import * as Workspace from '../state/workspace';

export const FilePreview: FC = () => {
  // New.
  const selectFile = Workspace.useSelectFile();
  const closeFile = Workspace.useCloseFile();
  const files = useRecoilValue(Workspace.openFiles);
  const currentFile = useRecoilValue(Workspace.currentFile);

  const tabs = useMemo(() => {
    return files.map((file) => {
      return {
        id: file.path as string,
        label: file.name,
      };
    });
  }, [files]);

  return (
    <>
      <Tabs
        selectedId={currentFile ? currentFile.path : undefined}
        tabs={tabs}
        onClick={(id) => {
          // New
          selectFile(id);
        }}
        onClose={(id) => {
          // New
          closeFile(id);
        }}
      />
      <div style={{ flex: '1 1 0px', flexDirection: 'row', display: 'flex' }}>
        {files.map((file) => {
          const isFocussed = currentFile && currentFile.sha === file.sha;
          return (
            <div
              key={file.sha}
              style={{
                display: isFocussed ? 'block' : 'none',
                // height: isFocussed ? 'auto' : '0px',
                overflow: 'hidden',
                flex: '1 1 0px',
              }}
            >
              {file.sha ? <ViewFile id={file.path} sha={file.sha} /> : null}
            </div>
          );
        })}
      </div>
    </>
  );
};
