import styled, { css } from 'styled-components';
import { font } from '../variables';

export const TreeNodeContainer = styled.div<{ $depth?: number; $selected?: boolean }>`
  display: flex;
  height: 20px;
  font-family: ${font};
  ${(props) =>
    props.$depth &&
    css`
      padding-left: ${props.$depth * 18}px;
    `} ${(props) =>
    props.$selected &&
    css`
      background: #e4eaff;
    `}
`;
