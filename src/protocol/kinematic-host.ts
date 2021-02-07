/**
 * Kinematic Host
 *
 * Utilities for communicating with plugins themselves.
 *
 *  MVP for viewers:
 *  - Loading available plugins (default only)
 *  - Lifecycle events
 *  - Sending / opening files
 *  - Closing files
 *  - Focus and un-focus
 *
 *  Full list of ideas
 *  - Access to the whole repository?
 *  - Loading files
 *  - Saving files
 *  - Creating new files?
 *  - Running the bundler
 *  - Handling fallbacks
 *  - Listing all available plugins
 *  - Accepting repository configuration
 */
import { KinematicHostSession } from './kinematic-host-session';
import { nanoid } from 'nanoid';
import { KinematicEvent } from './kinematic-events';

export type KinematicHostConfig = {
  // No config yet.
  viewers?: Array<{
    displayName?: string;
    paths: string[];
    loaders: string[];
  }>;
};

export class Host {
  config: KinematicHostConfig;
  projectId: string;
  private readonly sessions: {
    [sessionId: string]: KinematicHostSession;
  };

  constructor(projectId: string, config: KinematicHostConfig) {
    this.projectId = projectId;
    this.config = config;
    this.sessions = {};

    this.initWindowListeners();
  }

  async createSession(iframe: HTMLIFrameElement, origin: string) {
    await new Promise((resolve) => {
      iframe.addEventListener('load', () => {
        resolve(undefined);
      });
    });

    const sessionId = nanoid(12);
    const session = new KinematicHostSession({ sessionId, origin, frame: iframe });
    this.sessions[sessionId] = session;

    // Dispatch a session verify event to the client.
    session.dispatchEvent('SESSION_VERIFY');

    return new Promise<KinematicHostSession>((resolve, err) => {
      const callback = () => {
        session.removeEventListener('CLIENT_VERIFY', callback);

        if (session.isValid()) {
          resolve(session);
        } else {
          err();
        }
      };

      session.addEventListener('CLIENT_VERIFY', callback);
    });
  }

  async openFile(name: string, content: string) {
    // 1. Send request for opening, wait for ready
    // ...
    // @todo implement
  }

  handleSessionEvent<Type extends string = string, Payload = any>(event: KinematicEvent<Type, Payload>): void {
    // Some events are handled by this implementation.
    // The rest are passed to the session.
    const session = this.sessions[event.session];
    if (!session) {
      // @todo error handling.
      return;
    }

    // Handle event.
    session.handleEvent(event.type as any     , event.payload, event.source);
  }

  dispatchEventToClient<Type extends string = string, Payload = any>(event: KinematicEvent<Type, Payload>): void {
    // Dispatches an event to the client.
    const session = this.sessions[event.session];
    if (!session) {
      // Nothing to dispatch to.
      return;
    }

    session.handleEvent(event.type as any, event.payload, event.source);
  }

  private initWindowListeners(): void {
    window.addEventListener('message', (e: MessageEvent) => {
      // @todo any other validation we need to do here?
      if (!e.data || typeof e.data !== 'string') {
        // No message for us.
        return;
      }
      try {
        const data = JSON.parse(e.data) as KinematicEvent;

        if (!data.__kinematic__ || !data.type) {
          // Not sent from Kinematic.
          return;
        }

        if (!data.session || !data.source) {
          // Not valid.
          return;
        }

        if (!this.sessions[data.session]) {
          // Not part of this host.
          return;
        }

        this.handleSessionEvent(data);
      } catch (err) {
        // Might not be serialised, we will ignore these in prod most likely.
        console.error(err);
      }
    });
  }
}
