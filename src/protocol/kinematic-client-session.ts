import { nanoid } from 'nanoid';
import { ClientEvents, KinematicEvent, SessionEvents } from './kinematic-events';

export class ClientSession {
  readonly sessionId: string;
  readonly kinematicHost: string;
  private clientInformation: any;
  private hostSessionId = '';
  private isVerified = false;
  eventSource: Window | null = null;
  private listeners: { [name: string]: Array<(payload: any) => void> } = {};

  constructor(config: { kinematicHost: string; clientInformation?: any }) {
    this.sessionId = nanoid(12);
    this.kinematicHost = config.kinematicHost;
    this.clientInformation = config.clientInformation;

    this.initWindowListeners();
  }

  private initWindowListeners() {
    window.addEventListener('message', (e) => {
      // @todo any other validation we need to do here?
      if (!e.data || typeof e.data !== 'string') {
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
          console.error('Not valid.');
          return;
        }

        if (this.isVerified && data.session !== this.hostSessionId) {
          // Not part of this host.
          console.error('Not part of this host.');
          return;
        }

        // Set the source
        if (e.source) {
          this.eventSource = e.source as any;
        }

        // Dispatch internally.
        this.handleEvent(data.type as any, data.payload, data.source);
      } catch (err) {
        // Might not be serialised, we will ignore these in prod most likely.
        console.error(err);
      }
    });
  }

  whenReady(): Promise<this> {
    return new Promise((resolve, err) => {
      if (this.isVerified) {
        resolve(this);
        return;
      }
      const callback = () => {
        this.removeEventListener('SESSION_VERIFY', callback);
        if (this.isVerified) {
          resolve(this);
        } else {
          err();
        }
      };

      this.addEventListener('SESSION_VERIFY', callback);
    });
  }

  handleEvent(type: SessionEvents, payload: any, source: string): void {
    // If we don't have a session yet, we can only wait for that first.
    if (!this.isVerified && type !== 'SESSION_VERIFY') {
      // @todo error handling.
      console.log('CLIENT ERROR');
      return;
    }

    if (this.isVerified && !this.validateSource(source)) {
      // @todo error handling.
      console.log('CLIENT ERROR');
      return;
    }

    switch (type) {
      case 'SESSION_VERIFY': {
        // Internal response first.
        this.verifySession(source);
        break;
      }
    }

    if (this.listeners[type]) {
      for (const listener of this.listeners[type]) {
        listener(payload);
      }
    }
  }

  addEventListener(type: string, callback: (payload: any) => void): void {
    if (!this.listeners[type]) {
      this.listeners[type] = [];
    } else if (this.listeners[type].indexOf(callback) === -1) {
      return;
    }

    this.listeners[type].push(callback);
  }

  removeEventListener(type: string, callbackToRemove: (payload: any) => void): void {
    if (!this.listeners[type]) {
      return;
    }
    this.listeners[type] = this.listeners[type].filter((callback) => callback !== callbackToRemove);
  }

  dispatchEvent(type: ClientEvents, payload?: any): void {
    if (!this.isVerified) {
      // @todo error handling or possible queue up events?
      return;
    }

    if (!this.eventSource) {
      // @todo error handling.
      console.log('CLIENT ERROR');
      return;
    }

    const event: KinematicEvent = {
      type,
      payload,
      session: this.hostSessionId,
      source: this.sessionId,
      __kinematic__: true,
    };

    this.eventSource.postMessage(JSON.stringify(event), this.kinematicHost);
  }

  private verifySession(source: string) {
    this.hostSessionId = source;
    if (this.eventSource) {
      this.isVerified = true;
      this.dispatchEvent('CLIENT_VERIFY');
    }
  }

  validateSource(source: string) {
    return source === this.hostSessionId;
  }
}
