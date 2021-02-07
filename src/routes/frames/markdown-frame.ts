import { RouteMiddleware } from '../../types/application';

export const markdownFrame: RouteMiddleware = async (context) => {
  context.response.body = `
<html lang="en">
  <head>
  <title>Markdown frame</title>
  </head>
  <body>
    <script src="https://cdn.jsdelivr.net/npm/remarkable@2.0.1/dist/remarkable.min.js"></script>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/github-markdown-css@4.0.0/github-markdown.css" />
    <div id="root" class="markdown-body"></div>
    <script src="https://cdn.jsdelivr.net/npm/@kinematic.dev/helpers@0.0.2/dist/index.umd.js"></script>
    <script type="application/javascript">
      console.log('Markdown frame starting...');
    
      const viewer = new Kinematic.Viewer({
        id: 'markdown-viewer',
        session: {
           kinematicHost: '${process.env.KINEMATIC_HOST || 'http://localhost:3000/'}'
        }
      });
      
      // const {Remarkable} = require('remarkable');
      
      var md = new remarkable.Remarkable('full');
      
      
      viewer.acceptAny(file => {
        console.log(file);
        document.getElementById('root').innerHTML = md.render(file);
      });

    </script>
  </body>
</html>
  `;
};
