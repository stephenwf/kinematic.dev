import { RouteMiddleware } from '../types/application';
import koaPassport from 'koa-passport';
import { config } from '../config';

export const loginAction: RouteMiddleware = koaPassport.authenticate('github', {
  scope: config.github.scope,
});

export const authCallback: RouteMiddleware = koaPassport.authenticate('github', {
  successRedirect: '/dashboard',
  failureRedirect: '/',
});

export const logoutAction: RouteMiddleware = (context) => {
  // There is also an option here for us to logout of auth0 session too, but I don't think this is required.
  context.logout();
  context.redirect('/');
};
