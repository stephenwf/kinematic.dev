// This one is simple. It accepts viewer events.

import { nanoid } from 'nanoid';
import { ClientSession } from './kinematic-client-session';

export type ViewerConfig = {
  id: string;
  session: {
    kinematicHost: string;
  };
};

/**
 * Kinematic Viewer
 *
 * Example:
 *
 *   const viewer = new KinematicViewer({
 *     id: 'stephenwf/my-kinematic-viewer'
 *   });
 *
 *   viewer.acceptFile('.tsx', (tsxSourceCode) => {
 *     // Do something with the source.
 *   });
 *
 *   viewer.addValidation('.json', (source) => {
 *     // Add some clever validation, this will let Kinematic
 *     // know that the file type is not supported and give it the
 *     // opportunity to fallback to something else.
 *     return true;
 *   });
 *
 *   viewer.beforeClose('.json', () => {
 *     // Do something before the file is closed by the user.
 *   });
 *
 *   // Close the file, if you have some custom UI to do this.
 *   viewer.closeFile();
 *
 */
export class Viewer {
  readonly clientId: string;
  sessionId = '';
  config: ViewerConfig;
  session: ClientSession;
  acceptAnyCallbacks: Array<(file: string) => void> = [];
  constructor(config: ViewerConfig) {
    this.config = config;
    this.clientId = nanoid(12);
    this.session = new ClientSession(config.session);
    this.initEvents();
  }

  initEvents() {
    this.session.addEventListener('FILE_LOADED', (data) => {
      this.loadFile(data.content);
    });
  }

  loadFile(file: any) {
    // Only support acceptAny for now
    for (const acceptCallback of this.acceptAnyCallbacks) {
      acceptCallback(file);
    }
    // @todo use loaders from config
    // @todo use loaders from acceptFile
    // @todo use validation
  }

  async whenReady() {
    await this.session.whenReady();
    return this;
  }

  acceptAny(callback: (file: string) => void) {
    // Universal rendering, even skips validation, if accept file is set, check those first.
    if (this.acceptAnyCallbacks.indexOf(callback) === -1) {
      this.acceptAnyCallbacks.push(callback);
    }
  }

  acceptFile(match: string, callback: (file: string) => void) {
    // 1. If the file is already displayed, then do nothing.
    // 2. If a validation rule exists, call it.
    // 3. If the file is not yet displayed, then check if this new rule applied and display it.
  }

  addValidation(match: string, validation: (file: string) => boolean | Promise<boolean>) {
    // Validate that you can render the file.
  }

  onUnknownFile(callback: (file: string) => void) {
    // Unknown.
  }

  beforeClose(match: string, callback: () => void) {
    // Register some code that will run between the user choosing to close the file
    // and the file being closed.
  }

  closeFile() {
    // Initiate the closing of a file.
  }
}
