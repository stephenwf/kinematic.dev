import { RouteMiddleware } from '../../types/application';

export const echoFrame: RouteMiddleware = async (context) => {
  context.response.body = `
<html lang="en">
  <head>
  <title>Echo frame</title>
  </head>
  <body>
    <pre id="root"></pre>
    <script src="https://cdn.jsdelivr.net/npm/@kinematic.dev/helpers@0.0.2/dist/index.umd.js"></script>
    <script type="application/javascript">
      console.log('Echo frame starting...');
    
      const viewer = new Kinematic.Viewer({
        id: 'echo-viewer',
        session: {
           kinematicHost: '${process.env.KINEMATIC_HOST || 'http://localhost:3000/'}'
        }
      });
      
      viewer.acceptAny(file => {
        console.log(file);
        document.getElementById('root').innerText = file;
      });

    </script>
  </body>
</html>
  `;
};
