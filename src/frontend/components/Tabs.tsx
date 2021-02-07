import styled, { css } from 'styled-components';
import { FC } from 'react';
import { CloseIcon } from '../icons/CloseIcon';
import React from 'react';
import { font } from '../variables';

const TabItem = styled.div<{ $selected?: boolean }>`
  flex-direction: row;
  padding: 5px;
  display: inline-flex;
  align-items: center;
  ${(props) =>
    props.$selected &&
    css`
      background: #e5eafd;
    `}
`;

const TabLabel = styled.div`
  flex: 1 1 0px;
  max-width: 100px;
  margin-right: 15px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  user-select: none;
`;

const TabContainer = styled.div`
  font-family: ${font};
  border-bottom: 1px solid #e5eafd;
`;

type Tab = {
  id: string;
  label: string;
};

export const Tabs: FC<{
  tabs: Tab[];
  selectedId?: string;
  onClick: (id: string) => void;
  onClose: (id: string) => void;
}> = ({ tabs, selectedId, onClick, onClose }) => {
  return (
    <TabContainer>
      {tabs.map((tab) => {
        return (
          <TabItem key={tab.id} $selected={tab.id === selectedId}>
            <TabLabel onClick={() => onClick(tab.id)}>{tab.label}</TabLabel>
            <CloseIcon onClick={() => onClose(tab.id)} />
          </TabItem>
        );
      })}
    </TabContainer>
  );
};
