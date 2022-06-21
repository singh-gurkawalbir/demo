
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { MFA_SETUP_ASYNC_KEY, FORM_SAVE_STATUS } from '../../../../utils/constants';
import useEnqueueSnackbar from '../../../../hooks/enqueueSnackbar';
import messageStore from '../../../../utils/messageStore';
import { selectors } from '../../../../reducers';
import actions from '../../../../actions';

export default function useNotifySetupSuccess({ mode = 'connect' }) {
  const setupSuccess = useSelector(state => selectors.asyncTaskStatus(state, MFA_SETUP_ASYNC_KEY) === FORM_SAVE_STATUS.COMPLETE);
  const mfaEnabled = useSelector(state => selectors.isMFAEnabled(state));
  const dispatch = useDispatch();
  const [enquesnackbar] = useEnqueueSnackbar();

  // TODO: Currently, when connect is successful, it shows enable message
  // fix this once BE gives connected flag
  useEffect(() => {
    if (setupSuccess) {
      if (mode === 'connect') {
        enquesnackbar({
          message: messageStore('MFA_SETUP_SUCCESS'),
          variant: 'success',
        });
      }
      if (mode === 'switch') {
        enquesnackbar({
          message: messageStore(mfaEnabled ? 'MFA_ENABLED' : 'MFA_DISABLED'),
          variant: 'success',
        });
      }
      dispatch(actions.asyncTask.clear(MFA_SETUP_ASYNC_KEY));
    }
  }, [mfaEnabled, setupSuccess, enquesnackbar, dispatch, mode]);
}
