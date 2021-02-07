/**
 * HTTP node library.
 * https://nodejs.org/api/http.html
 *
 * From browser code, you will define handlers for your server. When you start a server a message channel will be opened
 * on the port you specified. This will instruct the service worker to relay requests back to your frontend code.
 *
 * If you start a server on localhost:8080, any fetch requests to that host will:
 * - Send a request message back to your application
 * - Run the handler you pass to createServer
 * - Send a response message to the service worker
 * - Return the result back to the browser
 *
 * If you start an 8080 localhost server in one window, you should be able to access it from another window using
 * the same service worker.
 */

/**
 * The first shim will be create server.
 */
export function createServer(
  requestListener: (req: Request, res: Response) => void
): { listen: (port: number) => void } {
  return {
    listen(port) {
      // 1. Register our server with the service worker.
      // 2. Wait for registration response event
      // 3. Add listener on same channel for requests
      //     - Create empty response
      //     - Call the requestListener with request and empty response
      //     - Pass the response back to the service worker
    },
  };
}
