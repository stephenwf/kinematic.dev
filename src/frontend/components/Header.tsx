import styled from 'styled-components';
import React from 'react';
import { KinematicIcon } from '../icons/KinematicIcon';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { UserDetails } from '../../types/schemas/user-details';
import { defaultConfig } from '../config/default-react-query';
import { font } from '../variables';

// Logo
// Text logo
// User
// Logout

const Logo = styled.div`
  display: flex;
  align-items: center;
  margin-right: auto;
  text-decoration: none;

  svg {
    font-size: 2.4em;
  }
`;

const LogoText = styled.div`
  font-size: 1.75em;
  font-weight: 600;
  margin-left: 0.8em;
  color: #000;
`;

const HeaderContainer = styled.div`
  font-family: ${font};
  display: flex;
  padding: 2em 1.5em;
  margin: 0 1em;
  border-bottom: 1px solid #ddd;
`;

const CurrentUser = styled.div`
  display: flex;
  align-items: center;
`;

const CurrentUserImage = styled.img`
  height: 30px;
  margin: 0 1em;
`;

const CurrentUserName = styled.div`
  font-size: 1em;
`;

const LogoutButton = styled.div`
  font-size: 1em;
  font-weight: 600;
  padding-left: 1em;
  color: #000;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

export const Header: React.FC = () => {
  const { data: details } = useQuery(
    'current-user',
    async () => {
      const resp = await fetch(`/api/me`);

      return (await resp.json()) as { user: UserDetails };
    },
    defaultConfig
  );

  if (!details) {
    return <div>Loading...</div>;
  }

  return (
    <HeaderContainer>
      <Logo as={Link} to="/dashboard">
        <KinematicIcon />
        <LogoText>Kinematic</LogoText>
      </Logo>

      {details ? (
        <CurrentUser>
          {details.user.photo ? <CurrentUserImage src={`${details.user.photo}&size=60`} /> : null}
          <CurrentUserName>{details.user.username}</CurrentUserName>
          <LogoutButton as={'a'} href="/logout">
            Logout
          </LogoutButton>
        </CurrentUser>
      ) : null}
    </HeaderContainer>
  );
};
