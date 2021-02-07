import { RouteMiddleware } from '../types/application';

export const indexPage: RouteMiddleware = (context) => {
  const bundle = context.routes.url('assets-bundles');

  if (!context.isAuthenticated()) {
    context.redirect('/login');
    return;
  }

  context.response.body = `
    <html lang="en">
      <head>
      <title>Account management</title>
      <style>
        #root {
            flex: 1 1 0px;
            display: flex;
            flex-direction: column;
            height: 100vh;
        }
        *, *:before, *:after {
          box-sizing: border-box;
        }
        html, body { margin: 0; padding: 0; }
      </style>
      </head>
      <body>
        <div id="root"></div>
        
        <script type="application/javascript" src="${bundle}"></script>
      </body>
    </html>
  `;
};
