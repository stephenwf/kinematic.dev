import { StrategyOption } from 'passport-github2';
import { opts as SessionOpts } from 'koa-session';
// @ts-ignore
import koaRedis from 'koa-redis';

const isProduction = process.env.NODE_ENV === 'production';

if (isProduction) {
  // Required environment variables.
  if (!process.env.KOA_SESSION_KEYS || process.env.KOA_SESSION_KEYS.trim() === '') {
    throw new Error(`Missing environment variable KOA_SESSION_KEYS`);
  }
}

export const port = process.env.SERVER_PORT || 3000;

// Any config derived from env here.
export const config = {
  // Random values used for signing cookies used for the session. Can be comma separated list.
  sessionKeys: process.env.KOA_SESSION_KEYS ? process.env.KOA_SESSION_KEYS.split(',') : ['local_value'],

  // Method, set to local for testing.
  authMethod: (isProduction ? 'auth0' : process.env.AUTH_METHOD || 'local') as 'auth0' | 'local',

  // Github auth.
  github: {
    clientID: process.env.GITHUB_CLIENT_ID as string,
    clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    callbackURL: process.env.GITHUB_CALLBACK_URL || `http://localhost:${port}/callback`,
    scope: ['read:user', 'user:email', 'public_repo'],
  } as StrategyOption,

  session: {
    // Session / cookie options.
    store: process.env.REDIS_SERVER
      ? koaRedis({
          host: process.env.REDIS_SERVER || '127.0.0.1',
          port: Number(process.env.REDIS_PORT) || 6379,
        })
      : undefined,
  } as Partial<SessionOpts>,

  testUser: isProduction
    ? undefined
    : {
        username: process.env.TEST_USER || 'test',
        password: process.env.TEST_PASSWORD || 'test',
      },
};
