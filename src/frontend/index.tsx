import React from 'react';
import { render } from 'react-dom';
import { QueryCache, ReactQueryCacheProvider } from 'react-query';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import { Header } from './components/Header';
import { Dashboard } from './sections/Dashboard';
import { ViewProject } from './sections/ViewProject';

const root = document.getElementById('root');

const queryCache = new QueryCache();

// if ('serviceWorker' in navigator) {
//   navigator.serviceWorker
//     .register('/sw.js', { scope: '/' })
//     .then((reg) => {
//       // registration worked
//       console.log('Registration succeeded. Scope is ' + reg.scope);
//
//       if (navigator.serviceWorker.controller) {
//         // Initialise messaging.
//         const messageChannel = new MessageChannel();
//         // Send message.
//         navigator.serviceWorker.controller.postMessage(
//           {
//             type: 'INIT_PORT',
//           },
//           [messageChannel.port2]
//         );
//
//         messageChannel.port1.onmessage = (event) => {
//           // Print the result
//           console.log('SW message: ', event.data);
//         };
//       }
//
//       setTimeout(() => {
//         fetch(`http://localhost:8080`)
//           .then((r) => r.json())
//           .then((json) => {
//             console.log('localhost response!', json);
//           });
//       }, 1000);
//     })
//     .catch((error) => {
//       // registration failed
//       console.log('Registration failed with ' + error);
//     });
// }

if (root) {
  render(
    <ReactQueryCacheProvider queryCache={queryCache}>
      <RecoilRoot>
        <Router>
          <Header />
          <Switch>
            <Route path="/dashboard">
              <Dashboard />
            </Route>
            <Route
              path={[
                // Show the current file.
                '/browse/:user/:repo/:branch/:path*',
                // Show no file open.
                '/browse/:user/:repo/:branch',
                // Possibly show a branch selector?
                '/browse/:user/:repo',
              ]}
            >
              <ViewProject />
            </Route>
          </Switch>
        </Router>
      </RecoilRoot>
    </ReactQueryCacheProvider>,
    root
  );
} else {
  console.warn('Could not mount application, #root not found');
}
