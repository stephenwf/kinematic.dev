import React, { FC } from 'react';
import { Tree } from '../components/Tree';

export default { title: 'Tree Node' };

export const DefaultView: FC = () => {
  return (
    <Tree
      onOpenItem={() => {
        // no-op
      }}
      tree={{
        type: 'directory',
        id: 'root',
        name: 'stephenwf/some-repo',
        children: [
          {
            type: 'file',
            name: 'test.tsx',
            id: 'root/test.tsx',
          },
        ],
      }}
    />
  );
};
