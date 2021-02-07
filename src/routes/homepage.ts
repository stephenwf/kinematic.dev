import { RouteMiddleware } from '../types/application';
import { renderToString } from 'react-dom/server';
import { Homepage } from '../frontend/homepage';
import React from 'react';
import { ServerStyleSheet } from 'styled-components';

export const homepage: RouteMiddleware = (context) => {
  if (context.isAuthenticated()) {
    context.redirect('/dashboard');
    return;
  }

  const sheet = new ServerStyleSheet();

  const markup = renderToString(sheet.collectStyles(React.createElement(Homepage)));

  const styles = sheet.getStyleTags();

  context.response.body = `
  <html lang="en">
      <head>
      <title>Kinematic</title>
      ${styles}
      </head>
      <body>
        ${markup}
      </body>
    </html>
  `;
};
