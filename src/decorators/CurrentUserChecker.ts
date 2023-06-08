import { Action } from 'routing-controllers';

export const currentUserChecker = (action: Action): Promise<boolean> => {
  return new Promise((resolve) => {
    const user = action.request.user;
    if(!user) resolve(user);
    resolve(user);
  });
};
