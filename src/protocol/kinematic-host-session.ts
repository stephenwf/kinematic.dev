/**
 * Kinematic session
 *
 * This is the lifecycle of an iframe.
 *
 * It is used to create messages back and forth.
 *
 * Lifecycle.
 *
 * - iFrame created
 * - iFrame listens for verify event [ SESSION_VERIFY ]
 * - iFrame loaded
 * - Host listens for messages on window event
 * - Host creates session, with hash and sends verify event [ SESSION_VERIFY ]
 * - iFrame handler receives verify and sends back its own hash. [ CLIENT_VERIFY ]
 * - iFrame handler checks hash against its own and stores client hash
 * - iFrame sends file loading event [ FILE_LOADING ]
 * - Host shows loading interface
 * - iFrame sends file contents event [ FILE_LOADED ]
 * - Host displays file
 * - [ .. other events .. ]
 * - User closes file
 * - iFrame not destroyed
 * - iFrame handler sends file close event [ SESSION_CLOSE_REQUEST ]
 * - iFrame handler sets timeout to destroy regardless.
 * - Host sends back any events it needs to
 * - Host sends final accept close event [ CLIENT_CLOSE_REQUEST ]
 * - iFrame destroyed
 */
import { ClientEvents, FileEvents, KinematicEvent, SessionEvents } from './kinematic-events';

export class KinematicHostSession {
  private readonly hostSessionId;
  private readonly clientOrigin;
  private readonly frame: HTMLIFrameElement;
  private clientSessionId = '';
  private clientInformation: any = {};
  private isVerified = false;
  private listeners: { [name: string]: Array<(payload: any) => void> } = {};

  constructor(options: { sessionId: string; origin: string; frame: HTMLIFrameElement }) {
    this.hostSessionId = options.sessionId;
    this.clientOrigin = options.origin;
    this.frame = options.frame;
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

  dispatchEvent(type: SessionEvents | FileEvents, payload?: any): void {
    if (!this.isVerified && type !== 'SESSION_VERIFY') {
      // @todo error handling.
      console.error('Error');
      return;
    }

    if (!this.frame.contentWindow) {
      // @todo error handling.
      console.error('Error');
      return;
    }

    const event: KinematicEvent = {
      type,
      payload,
      session: this.hostSessionId,
      source: this.hostSessionId,
      __kinematic__: true,
    };

    this.frame.contentWindow.postMessage(JSON.stringify(event), this.clientOrigin);
  }

  validateSource(source: string, origin?: string) {
    if (origin) {
      return origin === this.clientOrigin && source === this.clientSessionId;
    }
    return source === this.clientSessionId;
  }

  handleEvent(type: ClientEvents, payload: any, source: string): void {
    // If we don't have a session yet, we can only wait for that first.
    if (!this.isVerified && type !== 'CLIENT_VERIFY') {
      // @todo error handling.
      console.error('Error');
      return;
    }

    if (this.isVerified && !this.validateSource(source)) {
      // @todo error handling.
      console.error('Error');
      return;
    }

    switch (type) {
      case 'CLIENT_VERIFY': {
        // Internal response first.
        this.verifySession(payload, source);
        break;
      }
      case 'CLIENT_CLOSE_REQUEST': {
        break;
      }
      case 'CLIENT_SAVE_REQUEST': {
        break;
      }
    }

    if (this.listeners[type]) {
      for (const listener of this.listeners[type]) {
        listener(payload);
      }
    }
  }

  private verifySession(clientInformation: any, source: string): void {
    if (!source) {
      // @todo error handling.
      console.error('Error');
      return;
    }
    this.clientInformation = clientInformation;
    this.clientSessionId = source;
    this.isVerified = true;
  }

  isValid() {
    return this.isVerified;
  }
}
