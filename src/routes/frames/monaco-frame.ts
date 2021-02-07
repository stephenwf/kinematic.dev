import { RouteMiddleware } from '../../types/application';

export const monacoFrame: RouteMiddleware = async (context) => {
  context.response.body = `
<html lang="en">
  <head>
  <title>Monaco frame</title>
  </head>
  <body>
    <div id="root" style="height: 100%">
    </div>
    <script src="https://cdn.jsdelivr.net/npm/@kinematic.dev/helpers@0.0.2/dist/index.umd.js"></script>
    <script src="https://unpkg.com/monaco-editor@0.22.3/min/vs/loader.js"></script>
    <script type="application/javascript">
      require.config({ paths: { vs: 'https://unpkg.com/monaco-editor@0.22.3/min/vs' } });
    
      const viewer = new Kinematic.Viewer({
        id: 'monaco-viewer',
        session: {
           kinematicHost: '${process.env.KINEMATIC_HOST || 'http://localhost:3000/'}'
        }
      });
     
      
      viewer.acceptAny(file => {
        require(['vs/editor/editor.main'], function () {
          
          monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
            target: 99,
            jsx: 'react',
            allowNonTsExtensions: true,
            declaration: true,
            noLibCheck: true
          });
          
          var editor = monaco.editor.create(document.getElementById('root'), {
            value: file,
            language: 'typescript'
          });
         
  
          window.onresize = function () {
            editor.layout();
          };
        });
      });

    </script>
  </body>
</html>
  `;
};
