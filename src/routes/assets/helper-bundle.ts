import path from 'path';
import send from 'koa-send';

export const helperBundle = (bundle: string) => async (context: any) => {
  const root = path.resolve(__dirname, '..', '..', '..', 'npm', 'kinematic-helpers', 'dist');

  await send(context, bundle, { root });
};
