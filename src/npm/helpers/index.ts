/**
 * This is the entrypoint to the frame build that can be included by 3rd and 1st party modules
 * who wish to use the protocol for communicating between frames.
 *
 * This should be a zero-dependency library where possible and the public API should not change,
 * even if the protocol does. If it does need to change, new APIs should be added, and old ones deprecated but
 * still supported.
 */

import { Viewer } from '../../protocol/kinematic-viewer';
import { Editor } from '../../protocol/kinematic-editor';
import { ClientSession } from '../../protocol/kinematic-client-session';

declare global {
  type Kinematic = {
    Viewer: typeof Viewer;
    Editor: typeof Editor;
    ClientSession: typeof ClientSession;
  };
}

// Class for creating a Kinematic viewer.
export * from '../../protocol/kinematic-viewer';

// Class for creating a Kinematic editor.
export * from '../../protocol/kinematic-editor';

// Lower-level session API.
export * from '../../protocol/kinematic-client-session';

// Class for creating a Kinematic bundle consumer.
// export * from '../protocol/kinematic-bundle';
