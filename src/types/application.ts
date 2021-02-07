import * as Koa from 'koa';
import { RouterParamContext } from '@koa/router';
import { router } from '../router';
import { Ajv } from 'ajv';
import { Octokit } from '@octokit/rest';
import { UserDetails } from './schemas/user-details';

export interface ApplicationState {
  user:
    | {
        accessToken: string;
        refreshToken: string;
        user: UserDetails;
      }
    | undefined;

  getGithubApi: () => Octokit;
}

export interface ApplicationContext {
  routes: typeof router;
  logout: () => void;
  isAuthenticated: () => boolean;
  ajv: Ajv;
}

export type RouteMiddleware<Params = any, Body = any> = Koa.Middleware<
  ApplicationState,
  ApplicationContext &
    Omit<RouterParamContext<ApplicationState, ApplicationContext>, 'params'> & { params: Params } & {
      requestBody: Body;
    }
>;
