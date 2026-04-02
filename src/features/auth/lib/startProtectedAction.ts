import type { NavigateFunction } from 'react-router-dom';
import { routePaths } from '../../../router/paths';
import {
  clearPendingProtectedAction,
  savePendingProtectedAction,
  type ProtectedActionIntent,
} from '../model/protectedAction';
import { hasAuthSession } from '../model/session';

export const startProtectedAction = (
  navigate: NavigateFunction,
  intent: ProtectedActionIntent,
): boolean => {
  if (hasAuthSession()) {
    if (intent.reason !== 'save-route') {
      clearPendingProtectedAction();
    }

    navigate(intent.redirectTo, {
      state: intent.redirectState,
    });

    return true;
  }

  savePendingProtectedAction(intent);
  navigate(routePaths.appAuthRequired, {
    state: intent,
  });
  return false;
};
