import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  useRouteMatch,
  useHistory,
  matchPath,
  useLocation,
} from 'react-router-dom';
import RightDrawer from '../../../drawer/Right';
import DrawerHeader from '../../../drawer/Right/DrawerHeader';
import ErrorDetails from './ErrorDetails';
import { selectors } from '../../../../reducers';
import useFormOnCancelContext from '../../../FormOnCancelContext';
import { ERROR_DETAIL_ACTIONS_ASYNC_KEY } from '../../../../constants';
import { drawerPaths, buildDrawerUrl } from '../../../../utils/rightDrawer';

const emptySet = [];

export default function ErrorDetailsPanel({ flowId, resourceId, isResolved }) {
  const allErrors = useSelector(state => {
    const allErrorDetails = selectors.allResourceErrorDetails(state, { flowId, resourceId, isResolved });

    return allErrorDetails.errors || emptySet;
  });
  const [mode, setMode] = useState('view');

  const selectedError = useSelector(state => {
    const defaultError = allErrors?.[0]?.errorId;
    const e = selectors.filter(state, 'openErrors');

    return e.selectedError || defaultError;
  });

  console.log({allErrors});
  const handleTabChange = useCallback((errorId, newValue) => {
    console.log('handling tab change');
    console.log({errorId, newValue});
    setMode(newValue);
  }, []);

  if (!allErrors || allErrors.length === 0) return <></>;

  return (
    <ErrorDetails
      flowId={flowId}
      resourceId={resourceId}
      isResolved={isResolved}
  //   onClose={handleClose}
      onTabChange={handleTabChange}
      mode={mode}
      errorId={selectedError}
    />
  );
}
