import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { MFA_SETUP_ASYNC_KEY, FORM_SAVE_STATUS } from '../../../../constants';
import useEnqueueSnackbar from '../../../../hooks/enqueueSnackbar';
import {message} from '../../../../utils/messageStore';
import { selectors } from '../../../../reducers';
import actions from '../../../../actions';

export default function useNotifySetupSuccess() {
  const setupSuccess = useSelector(state => selectors.asyncTaskStatus(state, MFA_SETUP_ASYNC_KEY) === FORM_SAVE_STATUS.COMPLETE);
  const mfaEnabled = useSelector(state => selectors.isMFAEnabled(state));
  const setupContext = useSelector(state => selectors.getSetupContext(state));
  const dispatch = useDispatch();
  const [enquesnackbar] = useEnqueueSnackbar();

  useEffect(() => {
    if (setupSuccess) {
      if (setupContext === 'setup') {
        enquesnackbar({
          message: message.MFA.SETUP_SUCCESS,
          variant: 'success',
        });
      }
      if (setupContext === 'update') {
        enquesnackbar({
          message: message.MFA.PRIMARY_ACCOUNT_UPDATED,
          variant: 'success',
        });
      }
      if (setupContext === 'switch') {
        enquesnackbar({
          message: mfaEnabled ? message.MFA.ENABLED : message.MFA.DISABLED,
          variant: 'success',
        });
      }
      dispatch(actions.asyncTask.clear(MFA_SETUP_ASYNC_KEY));
      dispatch(actions.mfa.clearSetupContext());
    }
  }, [mfaEnabled, setupSuccess, enquesnackbar, dispatch, setupContext]);
}
