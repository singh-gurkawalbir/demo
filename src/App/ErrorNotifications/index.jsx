import { useEffect } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import useEnqueueSnackbar from '../../hooks/enqueueSnackbar';
import actions from '../../actions';
import * as selectors from '../../reducers';

// NOTE: This could/should? be converted to a hook since it doesn't render anything...
// its just a useEffect hook. (useGenericErrorHandler?)
export default function ErrorNotifications() {
  const dispatch = useDispatch();
  const errors = useSelector(state => selectors.commsErrors(state), shallowEqual);
  const [enqueueSnackbar] = useEnqueueSnackbar();

  useEffect(() => {
    if (!errors) return;

    Object.keys(errors).forEach(key => {
      enqueueSnackbar({
        message: errors[key],
        variant: 'error',
        persist: true,
      });
    });
    dispatch(actions.clearComms());
  }, [errors, enqueueSnackbar, dispatch]);

  return null;
}
