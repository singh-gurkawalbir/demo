import React, { useEffect, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import useEnqueueSnackbar from '../../hooks/enqueueSnackbar';
import actions from '../../actions';
import { selectors } from '../../reducers';
import ErrorContent from '../../components/ErrorContent';

// NOTE: This could/should? be converted to a hook since it doesn't render anything...
// its just a useEffect hook. (could call it: useGenericErrorHandler?)
export default function ErrorNotifications() {
  const dispatch = useDispatch();
  const errors = useSelector(state => selectors.commsErrors(state), shallowEqual);
  const [enqueueSnackbar] = useEnqueueSnackbar();
  // const hasWarning = useSelector(state => selectors.reqsHasRetriedTillFailure(state));
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const setOnlineTrue = () => setIsOnline(true);
    const setOnlineFalse = () => setIsOnline(false);

    window.addEventListener('offline', setOnlineFalse);
    window.addEventListener('online', setOnlineTrue);

    return () => {
      window.removeEventListener('offline', setOnlineFalse);
      window.removeEventListener('online', setOnlineTrue);
    };
  }, []);

  useEffect(() => {
    if (!errors) return;

    if (isOnline) {
      Object.keys(errors).forEach(commKey => {
        const message = errors[commKey];

        enqueueSnackbar({
          message: <ErrorContent error={message} />,
          variant: 'error',
          key: commKey,
        });
      });
      dispatch(actions.api.clearComms());
    }
  }, [dispatch, enqueueSnackbar, errors, isOnline]);

  useEffect(() => {
    if (!isOnline) {
      enqueueSnackbar({
        message: <ErrorContent error="It seems that your internet connection may be offline. Check your connection, then reload. If you continue to have problems after verifying that your connection is working, try signing out and signing back in to integrator.io." />,
        variant: 'warning',
        persist: true,
        key: 'offline',
      });
    }
    dispatch(actions.api.clearComms());
  }, [dispatch, enqueueSnackbar, isOnline]);

  return null;
}
