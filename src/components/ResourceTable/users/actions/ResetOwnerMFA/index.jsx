import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import actions from '../../../../../actions';
import { MFA_OWNER_RESET_ASYNC_KEY, FORM_SAVE_STATUS } from '../../../../../constants';
import useEnqueueSnackbar from '../../../../../hooks/enqueueSnackbar';
import { selectors } from '../../../../../reducers';

export default {
  key: 'resetOwnerMFA',
  useLabel: () => 'Reset MFA',
  Component: ({rowData: user}) => {
    const dispatch = useDispatch();
    const [enquesnackbar] = useEnqueueSnackbar();
    const userName = user.sharedWithUser?.name || user.sharedWithUser?.email;
    const resetSuccess = useSelector(state => selectors.asyncTaskStatus(state, MFA_OWNER_RESET_ASYNC_KEY) === FORM_SAVE_STATUS.COMPLETE);

    useEffect(() => {
      dispatch(actions.mfa.resetOwnerMFA());
    }, [dispatch]);

    useEffect(() => {
      if (resetSuccess) {
        enquesnackbar({
          message: `MFA reset for ${userName}`,
          variant: 'success',
        });
        dispatch(actions.asyncTask.clear(MFA_OWNER_RESET_ASYNC_KEY));
      }
    }, [dispatch, enquesnackbar, resetSuccess, userName]);

    return null;
  },
};
