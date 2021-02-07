import { RouteMiddleware } from '../../types/application';

export const getConfig: RouteMiddleware = async (context) => {
  const github = context.state.getGithubApi();

  const { user, branch, repo } = context.params;

  try {
    const blob = await github.repos.getContent({
      owner: user,
      repo,
      path: `kinematic.json`,
      ref: branch,
    });

    if (blob && blob.data && (blob.data as any).content) {
      context.response.body = new Buffer((blob.data as any).content, 'base64');
      return;
    }
  } catch (err) {
    // Config not found.
  }

  context.response.body = {
    '@context': 'https://kinematic.io/api/alpha/context.json',
    viewers: [],
  };
};
