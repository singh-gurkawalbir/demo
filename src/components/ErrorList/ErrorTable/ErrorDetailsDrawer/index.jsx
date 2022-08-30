import React, { useCallback, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  useRouteMatch,
  useHistory,
  matchPath,
  useLocation,
} from 'react-router-dom';
import actions from '../../../../actions';
import RightDrawer from '../../../drawer/Right';
import DrawerHeader from '../../../drawer/Right/DrawerHeader';
import ErrorDetails from '../../ErrorDetails';
import { selectors } from '../../../../reducers';
import useFormOnCancelContext from '../../../FormOnCancelContext';
import { ERROR_DETAIL_ACTIONS_ASYNC_KEY } from '../../../../constants';
import { drawerPaths, buildDrawerUrl } from '../../../../utils/rightDrawer';
import { FILTER_KEYS } from '../../../../utils/errorManagement';
import ErrorControls from '../ErrorDetailsPanel/ErrorControls';
import { useSelectorMemo } from '../../../../hooks';

const emptySet = [];

export default function ErrorDetailsDrawer({ flowId, resourceId, isResolved }) {
  const match = useRouteMatch();
  const { pathname } = useLocation();
  const history = useHistory();
  const dispatch = useDispatch();
  const filterKey = isResolved ? FILTER_KEYS.RESOLVED : FILTER_KEYS.OPEN;

  const { mode } = matchPath(pathname, {
    path: buildDrawerUrl({
      path: drawerPaths.ERROR_MANAGEMENT.V2.VIEW_ERROR_DETAILS,
      baseUrl: match.url,
    }),
  })?.params || {};

  const allErrors = useSelector(state => {
    const allErrorDetails = selectors.allResourceErrorDetails(state, { flowId, resourceId, isResolved });

    return allErrorDetails.errors || emptySet;
  });

  // Controls the nested drawer to open error details only when it is a valid errorId
  // TODO : @Raghu check for a better way to control
  const showDrawer = useMemo(() => {
    if (!match.isExact) {
      const matchErrorPath = matchPath(pathname, {
        path: buildDrawerUrl({
          path: drawerPaths.ERROR_MANAGEMENT.V2.VIEW_ERROR_DETAILS,
          baseUrl: match.url,
        }),
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
    dispatch(actions.patchFilter(filterKey, {
      activeErrorId: undefined,
    }));
    history.goBack();
  }, [dispatch, filterKey, history]);

  const handleTabChange = useCallback((errorId, newValue) => {
    history.replace(buildDrawerUrl({
      path: drawerPaths.ERROR_MANAGEMENT.V2.VIEW_ERROR_DETAILS,
      baseUrl: match.url,
      params: { errorId, mode: newValue },
    }));
  }, [history, match.url]);

  const {setCancelTriggered} = useFormOnCancelContext(ERROR_DETAIL_ACTIONS_ASYNC_KEY);
  const onClose = mode === 'editRetry' ? setCancelTriggered : handleClose;
  const errorConfig = useMemo(() => ({
    flowId,
    resourceId,
    isResolved,
  }), [isResolved, flowId, resourceId]);

  const errorsInPage = useSelectorMemo(selectors.mkResourceFilteredErrorsInCurrPageSelector, errorConfig);

  const activeErrorId = useSelector(state => {
    const e = selectors.filter(state, 'openErrors');

    return e.activeErrorId;
  });

  const handleNextOrPrev = useCallback(newErrorId => {
    if (!newErrorId) return;
    history.replace(buildDrawerUrl({
      path: drawerPaths.ERROR_MANAGEMENT.V2.VIEW_ERROR_DETAILS,
      baseUrl: match.url,
      params: { errorId: newErrorId, mode },
    }));
  }, [history, match.url, mode]);

  const errorDoc = useSelector(state =>
    selectors.resourceError(state, { flowId, resourceId, errorId: activeErrorId, isResolved })
  ) || {};
  const { retryDataKey: retryId} = errorDoc || {};

  if (!showDrawer) {
    return null;
  }

  return (
    <RightDrawer path={drawerPaths.ERROR_MANAGEMENT.V2.VIEW_ERROR_DETAILS} width="large" >
      <DrawerHeader title="View error details" handleClose={onClose}>
        {!isResolved && (
        <ErrorControls
          retryId={retryId}
          flowId={flowId}
          resourceId={resourceId}
          errorsInPage={errorsInPage}
          activeErrorId={activeErrorId}
          handlePrev={handleNextOrPrev}
          handleNext={handleNextOrPrev} />
        )}
      </DrawerHeader>
      <ErrorDetails
        flowId={flowId}
        resourceId={resourceId}
        isResolved={isResolved}
        onClose={handleClose}
        onTabChange={handleTabChange}
        handleNext={handleNextOrPrev} />
    </RightDrawer>
  );
}
