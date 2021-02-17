import React, { useEffect } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import useEnqueueSnackbar from '../../hooks/enqueueSnackbar';
import actions from '../../actions';
import { selectors } from '../../reducers';
import ErrorContent from '../../components/ErrorContent';

// NOTE: This could/should? be converted to a hook since it doesn't render anything...
// its just a useEffect hook. (could call it: useGenericErrorHandler?)
export default function ErrorNotifications() {
  const dispatch = useDispatch();
  const errors = useSelector(state => selectors.commsErrors(state), shallowEqual);
  const [enqueueSnackbar, closeSnackbar] = useEnqueueSnackbar();
  // const hasWarning = useSelector(state => selectors.reqsHasRetriedTillFailure(state));

  useEffect(() => {
    if (!errors) return;

    Object.keys(errors).forEach(key => {
      closeSnackbar(key);

      setTimeout(() => {
        enqueueSnackbar({
          message: <ErrorContent error={errors[key]} />,
          variant: 'error',
          persist: true,
          key,
        });
      }, 800);
    });

    dispatch(actions.clearComms());
  }, [errors, enqueueSnackbar, dispatch, closeSnackbar]);

  // Commented out the intermittent network issues warning snackbar
  // TODO: Surya enable it after december MR
  /*
  useEffect(() => {
    if (hasWarning) {
      enqueueSnackbar({
        message: <ErrorContent error="You may be experiencing intermittent network issues. Please check your internet connectivity." />,
        variant: 'warning',
        persist: true,
        preventDuplicate: true,
      });
    }
  }, [enqueueSnackbar, hasWarning]);
*/
  return null;
}
