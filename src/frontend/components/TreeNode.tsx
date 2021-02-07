import React, { FC, useContext, useState } from 'react';
import styled from 'styled-components';
import { FolderIcon } from '../icons/Folder';
import { FileIcon } from '../icons/FileIcon';
import { TreeObject } from '../../types/schema/tree-object';
import { PlaceholderIcon } from '../atoms/PlaceholderIcon';
import { PlaceholderArrow } from '../atoms/PlaceholderArrow';
import { Arrow } from '../icons/OpenArrowIcon';
import { TreeNodeContainer } from '../atoms/TreeNodeContainer';
import { TreeNodeLabel } from '../atoms/TreeNodeLabel';
import { TreeContext } from '../state/tree-context';
import { useRecoilState } from 'recoil';
import { treeState } from '../state/workspace';

export const TreeNode: FC<{ node: TreeObject; depth?: number }> = ({ node, depth = 0 }) => {
  const { currentItem, openItem, setCurrentItem } = useContext(TreeContext);
  const [open, setOpen] = useRecoilState(treeState({ id: node.id, depth }));

  return (
    <>
      <TreeNodeContainer
        $depth={depth}
        $selected={currentItem && currentItem.id === node.id}
        onMouseDown={() => setCurrentItem(node)}
      >
        {node.type === 'directory' ? <Arrow onClick={() => setOpen((o) => !o)} $open={open} /> : <PlaceholderArrow />}
        <PlaceholderIcon>
          {node.type === 'directory' ? <FolderIcon fill="#566ECE" /> : <FileIcon fill="#828D96" />}
        </PlaceholderIcon>
        <TreeNodeLabel
          onDoubleClick={() => {
            if (node.type === 'directory') {
              setOpen((o) => !o);
            } else {
              openItem(node);
            }
          }}
          title={node.name}
        >
          {node.name}
        </TreeNodeLabel>
      </TreeNodeContainer>
      {open && node.type === 'directory' && node.children.length ? (
        <div>
          {node.children.map((item) => {
            return <TreeNode key={item.id} node={item} depth={depth + 1} />;
          })}
        </div>
      ) : undefined}
    </>
  );
};
