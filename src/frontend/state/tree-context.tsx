import React from 'react';
import { TreeObject } from '../../types/schema/tree-object';

export const TreeContext = React.createContext<{
  currentItem?: TreeObject;
  setCurrentItem: (item: TreeObject) => void;
  openItem: (item: TreeObject) => void;
}>({
  currentItem: undefined,
  setCurrentItem: () => {
    // no-op.
  },
  openItem: () => {
    // no-op.
  },
});
