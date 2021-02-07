import { RouteMiddleware } from '../../types/application';

export const singleRepository: RouteMiddleware = async (context) => {
  const github = context.state.getGithubApi();

  const repo = await github.repos.get({
    repo: context.params.repo,
    owner: context.params.user,
  });

  context.response.body = repo.data;
};
