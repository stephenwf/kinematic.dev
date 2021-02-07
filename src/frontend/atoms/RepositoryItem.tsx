import styled, { css } from 'styled-components';
import { font } from '../variables';

export const RepositoryItem = styled.div<{ $active?: boolean; $interactive?: boolean }>`
  text-decoration: none;
  display: block;
  border-radius: 5px;
  padding: 0.5em;
  margin-bottom: 0.5em;
  font-family: ${font};

  ${(props) =>
    props.$interactive !== false &&
    css`
      &:hover {
        background: #ecf4fa;
      }
    `}
`;
