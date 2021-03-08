import React, { useCallback, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import {
  useRouteMatch,
  useHistory,
  matchPath,
  useLocation,
} from 'react-router-dom';
import RightDrawer from '../../../drawer/Right';
import DrawerHeader from '../../../drawer/Right/DrawerHeader';
import ErrorDetails from '../../ErrorDetails';
import { selectors } from '../../../../reducers';

const emptySet = [];

export default function ErrorDetailsDrawer({ flowId, resourceId, isResolved }) {
  const match = useRouteMatch();
  const { pathname } = useLocation();
  const history = useHistory();

  const allErrors = useSelector(state => {
    const allErrorDetails = selectors.allResourceErrorDetails(state, { flowId, resourceId, isResolved });

    return allErrorDetails.errors || emptySet;
  });

  // Controls the nested drawer to open error details only when it is a valid errorId
  // TODO : @Raghu check for a better way to control
  const showDrawer = useMemo(() => {
    if (!match.isExact) {
      const matchErrorPath = matchPath(pathname, {
        path: `${match.url}/details/:errorId/:mode`,
      });

      if (!matchErrorPath || !matchErrorPath.params) return true;
      const { errorId } = matchErrorPath.params;

      if (!errorId) return false;

      return allErrors.some(error => error.errorId === errorId);
    }
  }, [allErrors, match.isExact, match.url, pathname]);

  useEffect(() => {
    if (!showDrawer && allErrors.length && !match.isExact) {
      // Incase of an invalid nested url, redirects to current url
      history.replace(match.url);
    }
  }, [allErrors.length, history, match.isExact, match.url, showDrawer]);
  const handleClose = useCallback(() => {
    history.goBack();
  }, [history]);

  if (!showDrawer) {
    return null;
  }

  return (
    <RightDrawer
      path="details/:errorId/:mode"
      variant="temporary"
      hideBackButton>
      <DrawerHeader title="View error details" />
      <ErrorDetails
        flowId={flowId}
        resourceId={resourceId}
        isResolved={isResolved}
        onClose={handleClose}
          />
    </RightDrawer>
  );
}
