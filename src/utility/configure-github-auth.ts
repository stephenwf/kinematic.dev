import { Strategy as GitHubStrategy } from 'passport-github2';
import { config } from '../config';
import koaPassport from 'koa-passport';
import { UserDetails } from '../types/schemas/user-details';

export function configureGithubAuth(): void {
  const strategy = new GitHubStrategy(
    {
      clientID: config.github.clientID,
      clientSecret: config.github.clientSecret,
      callbackURL: config.github.callbackURL,
    },
    function (accessToken: string, refreshToken: string, profile: any, done: any) {
      done(null, {
        accessToken,
        refreshToken,
        user: {
          id: profile.id,
          username: profile.username,
          nodeId: profile.nodeId,
          displayName: profile.displayName,
          profileUrl: profile.profileUrl,
          photo: profile.photos[0] ? profile.photos[0].value : undefined,
        } as UserDetails,
      });
    }
  );

  koaPassport.use(strategy);

  koaPassport.serializeUser(function (user, done) {
    done(null, user);
  });

  koaPassport.deserializeUser(function (user, done) {
    if (!user) {
      done(null, false);
    } else {
      done(null, user);
    }
  });
}
