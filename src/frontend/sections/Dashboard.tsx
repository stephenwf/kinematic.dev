import React, { FC } from 'react';
import { Route, Switch } from 'react-router-dom';
import { RepositoryDetail } from './RepositoryDetail';
import { Repositories } from '../components/Repositories';
import { WelcomeScreen } from './WelcomeScreen';

export const Dashboard: FC = () => {
  return (
    <>
      <div style={{ display: 'flex' }}>
        <div style={{ width: 430 }}>
          <Repositories />
        </div>
        <div style={{ flex: '1 1 0px' }}>
          <Switch>
            <Route path="/dashboard" exact={true}>
              <WelcomeScreen />
            </Route>
            <Route path="/dashboard/info/:user/:repo">
              <RepositoryDetail />
            </Route>
          </Switch>
        </div>
      </div>
    </>
  );
};
