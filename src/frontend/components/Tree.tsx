import React, { FC, useCallback, useMemo, useState } from 'react';
import { TreeNode } from './TreeNode';
import { TreeObject } from '../../types/schema/tree-object';
import { TreeContext } from '../state/tree-context';

export const Tree: FC<{
  tree: TreeObject;
  onChangeItem?: (obj: TreeObject) => void;
  onOpenItem: (obj: TreeObject) => void;
}> = ({ onChangeItem, onOpenItem, tree }) => {
  const [currentItem, setCurrentItem] = useState<TreeObject | undefined>(undefined);

  const changeItem = useCallback(
    (item: any) => {
      setCurrentItem(item);
      if (onChangeItem) {
        onChangeItem(item);
      }
    },
    [onChangeItem]
  );

  return (
    <div>
      <TreeContext.Provider
        value={useMemo(() => ({ setCurrentItem: changeItem, currentItem, openItem: onOpenItem }), [
          changeItem,
          currentItem,
          onOpenItem,
        ])}
      >
        <TreeNode node={tree} />
      </TreeContext.Provider>
    </div>
  );
};
