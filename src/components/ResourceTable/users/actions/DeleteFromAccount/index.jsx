import { useCallback, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import actions from '../../../../../actions';
import actionTypes from '../../../../../actions/types';
import useEnqueueSnackbar from '../../../../../hooks/enqueueSnackbar';
import useCommStatus from '../../../../../hooks/useCommStatus';
import { COMM_STATES } from '../../../../../reducers/comms/networkComms';
import useConfirmDialog from '../../../../ConfirmDialog';
import { selectors } from '../../../../../reducers';

export default {
  key: 'removeUserFromAccount',
  useLabel: () => 'Remove user from account',
  mode: 'delete',
  Component: ({rowData: user}) => {
    const { confirmDialog } = useConfirmDialog();
    const dispatch = useDispatch();
    const [enquesnackbar] = useEnqueueSnackbar();
    const { _id: userId, sharedWithUser = {} } = user;

    const userPreferences = useSelector(state =>
      selectors.userPreferences(state)
    );

    const deleteFromAccount = useCallback(() => {
      confirmDialog({
        title: 'Confirm delete',
        message: 'Are you sure you want to delete this user?',
        buttons: [
          {
            label: 'Delete',
            error: true,
            onClick: () => {
              dispatch(actions.user.org.users.delete(userId, userPreferences.defaultAShareId === userId));
            },
          },
          {
            label: 'Cancel',
            variant: 'text',
          },
        ],
      });
    }, [confirmDialog, dispatch, userId, userPreferences.defaultAShareId]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => deleteFromAccount(), []);

    const commStatusHandler = useCallback(
      objStatus => {
        const {status, message} = objStatus.delete || {};
        const userName = sharedWithUser.name || sharedWithUser.email;

        if (status === COMM_STATES.ERROR) {
          enquesnackbar({
            message: `Deleting user ${userName} is failed due to the error "${message}"`,
            variant: status,
          });
        }
      },
      [enquesnackbar, sharedWithUser]
    );

    const actionsToMonitor = useMemo(() => ({
      delete: { action: actionTypes.USER.DELETE, resourceId: userId},
    }), [userId]);

    useCommStatus({
      actionsToMonitor,
      autoClearOnComplete: true,
      commStatusHandler,
    });

    return (
      null
    );
  },
};
