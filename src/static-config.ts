import { KinematicHostConfig } from './protocol/kinematic-host';

export const staticConfig = {
  explorer: {
    views: [
      {
        displayName: 'Documentation',
        test: 'docs/**/*.md',
      },
    ],
  },
  viewers: [
    {
      displayName: 'Echo viewer',
      test: /\.m?js$/,
      exclude: 'docs/',
      use: {
        loader: 'http://127.0.0.1/frames/echo-frame',
        options: {},
      },
    },
  ],
};
