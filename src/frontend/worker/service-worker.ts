const state: { port?: MessagePort } = {
  port: undefined,
};

self.addEventListener('install', () => {
  // Install.
});

self.addEventListener('activate', () => {
  // Activate.
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'INIT_PORT') {
    state.port = event.ports[0];
  }

  // console.log(`SW: Event`, event);
});

self.addEventListener('fetch', async (event: any) => {
  const url = new URL(event.request.url);

  if (url.hostname === 'localhost' && url.port === '8080') {

    // state.port?.postMessage({
    //   type: 'testing',
    //   hello: 'world',
    //   url: event.request.url,
    // });

    event.respondWith(
      new Promise((resolve) => {
        resolve(
          new Response(
            JSON.stringify({
              hello: 'world',
            }),
            {
              headers: { 'Content-Type': 'application/json' },
            }
          )
        );
      })
    );
  }
});
