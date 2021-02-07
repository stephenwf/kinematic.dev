export type SessionEvents = 'SESSION_VERIFY' | 'SESSION_VERIFY_RESPONSE' | 'SESSION_CLOSE_REQUEST';

export type UserEvents = 'USER_FILE_CLOSE';

export type FileEvents = 'FILE_LOADING' | 'FILE_LOADED' | 'FILE_CLOSED';

export type ClientEvents = 'CLIENT_CLOSE_REQUEST' | 'CLIENT_SAVE_REQUEST' | 'CLIENT_VERIFY';

export type KinematicEvent<Type extends string = string, Payload = any> = {
  __kinematic__: true;
  type: Type;
  payload: Payload;
  session: string;
  source: string;
};
