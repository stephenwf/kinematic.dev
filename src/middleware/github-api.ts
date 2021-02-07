import { RouteMiddleware } from '../types/application';
import { Octokit } from '@octokit/rest';
import { RequestError } from '../utility/errors/request-error';

export const githubApi: RouteMiddleware = async (context, next) => {
  context.state.getGithubApi = () => {
    const user = context.state.user;

    if (!user) {
      throw new RequestError('Not authorised');
    }

    return new Octokit({
      auth: `token ${user.accessToken}`,
    });
  };

  await next();
};
