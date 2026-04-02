import { Navigate, Outlet, useLocation } from 'react-router-dom';
import {
  deriveProtectedActionSourcePath,
  type ProtectedActionReason,
} from '../model/protectedAction';
import { hasAuthSession } from '../model/session';
import { routePaths } from '../../../router/paths';

interface RequireSessionProps {
  reason?: ProtectedActionReason;
}

export function RequireSession({ reason = 'booking' }: RequireSessionProps) {
  const location = useLocation();

  if (!hasAuthSession()) {
    return (
      <Navigate
        to={routePaths.appAuthRequired}
        replace
        state={{
          reason,
          redirectTo: `${location.pathname}${location.search}`,
          redirectState: location.state,
          sourcePath: deriveProtectedActionSourcePath(location.state) ?? routePaths.appHome,
        }}
      />
    );
  }

  return <Outlet />;
}
