import styled from 'styled-components';
import { CollapseIcon } from './CollapseIcon';

export const Arrow = styled(CollapseIcon)<{ $open?: boolean }>`
  height: 18px;
  width: 18px;
  align-self: center;
  transform-origin: center;
  transform: rotate(${(props) => (props.$open ? '0' : '270deg')});
`;
