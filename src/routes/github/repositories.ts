import { RouteMiddleware } from '../../types/application';
import { RequestError } from '../../utility/errors/request-error';

export const getRepositories: RouteMiddleware = async (context) => {
  const details = context.state.user;
  if (!details) {
    throw new RequestError('Not authorised');
  }

  const page = context.query.page ? Number(context.query.page) : 1;

  const github = context.state.getGithubApi();

  const repos = await github.request('GET /users/{org}/repos', {
    org: details.user.username,
    per_page: 15,
    page: page,
    type: 'public',
    sort: 'updated',
  });

  const mappedRepos = repos.data.map((repo: any) => {
    return {
      id: repo.id,
      branch: repo.default_branch,
      name: repo.name,
      full_name: repo.full_name,
      description: repo.description,
      stargazers_count: repo.stargazers_count,
      language: repo.language,
      size: repo.size,
      private: repo.private,
      fork: repo.fork,
      permissions: repo.permissions,
      updated_at: repo.updated_at,
    };
  });

  context.response.body = { repos: mappedRepos };
};
