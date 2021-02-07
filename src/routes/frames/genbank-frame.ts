import { RouteMiddleware } from '../../types/application';

export const genBankFrame: RouteMiddleware = async (context) => {
  context.response.body = `
<html lang="en">
  <head>
  <title>Genbank frame</title>
  </head>
  <body>
    <pre id="root"></pre>
    <script src="https://cdn.jsdelivr.net/npm/regenerator-runtime-only@0.8.38/runtime.js"></script>
    <script src="https://unpkg.com/seqviz"></script>
    <script src="https://cdn.jsdelivr.net/npm/@kinematic.dev/helpers@0.0.2/dist/index.umd.js"></script>
    <script type="application/javascript">
      console.log('Genbank frame starting...');
    
      const viewer = new Kinematic.Viewer({
        id: 'genbank-viewer',
        session: {
           kinematicHost: '${process.env.KINEMATIC_HOST || 'http://localhost:3000/'}'
        }
      });
      
      viewer.acceptAny(file => {
        window.seqviz
          .Viewer("root", {
            name: "L09136",
            file: file,
            style: { height: "100vh", width: "100vw" }
          })
          .render();
        console.log(file);
      });

    </script>
     
  </body>
</html>
  `;
};
