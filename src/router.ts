import { TypedRouter } from './utility/typed-router';
import { ping } from './routes/ping';
import { frontendBundles, serviceWorker } from './routes/assets/frontend-bundle';
import { indexPage } from './routes/index';
import { authCallback, loginAction, logoutAction } from './routes/auth';
import { homepage } from './routes/homepage';
import { getUserDetails } from './routes/get-user-details';
import { getRepositories } from './routes/github/repositories';
import { singleRepository } from './routes/github/single-repository';
import { getFileTree } from './routes/github/get-file-tree';
import { getBlob } from './routes/github/get-blob';
import { echoFrame } from './routes/frames/echo-frame';
import { helperBundle } from './routes/assets/helper-bundle';
import { monacoFrame } from './routes/frames/monaco-frame';
import { genBankFrame } from './routes/frames/genbank-frame';
import { markdownFrame } from './routes/frames/markdown-frame';
import { getConfig } from './routes/github/get-config';

export const router = new TypedRouter({
  // Example: Normal route
  ping: [TypedRouter.GET, '/ping', ping],

  // Frontend bundles.
  'helpers-bundle': [TypedRouter.GET, '/assets/helpers/index.umd.js', helperBundle('index.umd.js')],
  'helpers-bundle-map': [TypedRouter.GET, '/assets/helpers/index.umd.js.map', helperBundle('index.umd.js.map')],
  'assets-bundles': [TypedRouter.GET, '/assets/bundle.js', frontendBundles],
  'assets-sub-bundles': [TypedRouter.GET, '/assets/:bundleName', frontendBundles],
  'service-worker': [TypedRouter.GET, '/sw.js', serviceWorker],

  // Auth0 + Passport routes.
  login: [TypedRouter.GET, '/login', loginAction],
  logout: [TypedRouter.GET, '/logout', logoutAction],
  callback: [TypedRouter.GET, '/callback', authCallback],

  // API
  'user-details': [TypedRouter.GET, '/api/me', getUserDetails],
  'get-repos': [TypedRouter.GET, '/api/repos', getRepositories],
  'get-single-repo': [TypedRouter.GET, '/api/repos/:user/:repo', singleRepository],
  'get-repo-config': [TypedRouter.GET, '/api/config/:user/:repo/:branch', getConfig],
  'get-repo-tree': [TypedRouter.GET, '/api/tree/:user/:repo/:branch', getFileTree],
  'get-repo-blob': [TypedRouter.GET, '/api/blob/:owner/:repo/:file_sha', getBlob],

  // Frames
  'echo-frame': [TypedRouter.GET, '/frames/echo-frame', echoFrame],
  'monaco-frame': [TypedRouter.GET, '/frames/monaco-frame', monacoFrame],
  'genbank-frame': [TypedRouter.GET, '/frames/genbank-frame', genBankFrame],
  'markdown-frame': [TypedRouter.GET, '/frames/markdown-frame', markdownFrame],

  // Custom routes
  homepage: [TypedRouter.GET, '/', homepage],

  // Frontend fallback route.
  frontend: [TypedRouter.GET, /(.*)/ as any, indexPage],
});
