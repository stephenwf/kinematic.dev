import { RouteMiddleware } from '../types/application';
import { RequestError } from '../utility/errors/request-error';

export const getUserDetails: RouteMiddleware = async (context) => {
  const details = context.state.user;
  if (!details) {
    throw new RequestError('Not authorised');
  }
  context.response.body = {
    user: details.user,
  };
};
