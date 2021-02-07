import styled from 'styled-components';
import { font } from '../variables';

export const RepositoryContainer = styled.div<{ $isFetching?: boolean }>`
  margin: 0 1em;
  padding: 0 1em;
  border-right: 1px solid #eee;
  opacity: ${(props) => (props.$isFetching ? 0.5 : 1)};
  font-family: ${font};
`;
