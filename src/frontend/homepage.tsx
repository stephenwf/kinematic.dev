import React from 'react';
import styled from 'styled-components';
import { font } from './variables';
import { KinematicIcon } from './icons/KinematicIcon';

const PageContainer = styled.div`
  margin: 100px auto;
  max-width: 600px;
  padding: 20px;
  font-family: ${font};
  display: flex;
  flex-direction: column;
`;

const Title = styled.h1`
  font-size: 3em;
  position: relative;
  text-align: center;
`;

const Tag = styled.div`
  background: #a650fe;
  position: absolute;
  top: -20px;
  color: #fff;
  font-size: 0.75rem;
  padding: 0.15rem 0.3rem;
  right: 0;
`;

const Paragraph = styled.div`
  font-size: 1.25em;
  margin-bottom: 2.5em;
`;

const Button = styled.a`
  display: inline-block;
  margin: 0 auto;
  background: #39393e;
  padding: 0.75em 1em;
  text-decoration: none;
  color: #fff;
`;

const GithubButton: React.FC = () => {
  return (
    <Button href="/login">
      <span>Login with Github</span>
    </Button>
  );
};

export const Homepage: React.FC = () => {
  return (
    <PageContainer>
      <KinematicIcon style={{ fontSize: '70px', alignSelf: 'center' }} />
      <Title>
        Kinematic
        <Tag>ALPHA</Tag>
      </Title>
      <Paragraph>
        View and edit files from your Github repositories using a variety of web-based editors and viewers, or build
        your own.
      </Paragraph>
      <GithubButton />
    </PageContainer>
  );
};
