import Koa from 'koa';
import json from 'koa-json';
import logger from 'koa-logger';
import Ajv from 'ajv';
import * as path from 'path';
import { readdirSync, readFileSync } from 'fs';
import { errorHandler } from './middleware/error-handler';
import { TypedRouter } from './utility/typed-router';
import koaPassport from 'koa-passport';
import { config } from './config';
import { configureGithubAuth } from './utility/configure-github-auth';

export async function createApp(router: TypedRouter<any, any>) {
  const app = new Koa();

  app.context.routes = router;

  // Session.
  const session = require('koa-session');
  app.keys = config.sessionKeys;
  app.use(session(config.session, app));

  configureGithubAuth();

  app.use(koaPassport.initialize());
  app.use(koaPassport.session());

  // Validator.
  app.context.ajv = new Ajv();
  for (const file of readdirSync(path.resolve(__dirname, '..', 'schemas'))) {
    if (file.endsWith('.json')) {
      const name = path.basename(file, '.json');
      app.context.ajv.addSchema(
        JSON.parse(readFileSync(path.resolve(__dirname, '..', 'schemas', file)).toString('utf-8')),
        name
      );
    }
  }

  app.use(json({ pretty: process.env.NODE_ENV !== 'production' }));
  app.use(logger());
  app.use(errorHandler);
  app.use(router.routes()).use(router.allowedMethods());

  process.on('SIGINT', async () => {
    // Close any connections and clean up.
    process.exit(0);
  });

  return app;
}
