import { RouteMiddleware } from '../../types/application';

export const getBlob: RouteMiddleware = async (context) => {
  const github = context.state.getGithubApi();

  const { owner, repo, file_sha } = context.params;

  const blob = await github.git.getBlob({
    owner,
    repo,
    file_sha,
  });

  context.response.body = blob.data;
};
