import styled from 'styled-components';
import { githubLanguageColors } from '../config/github-language-colours';

export const LanguageColor = styled.span<{ $language: keyof typeof githubLanguageColors }>`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  display: inline-block;
  background: ${(props) => githubLanguageColors[props.$language] || '#999'};
`;
