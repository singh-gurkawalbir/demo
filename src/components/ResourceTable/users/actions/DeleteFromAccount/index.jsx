import { useCallback, useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import actions from '../../../../../actions';
import actionTypes from '../../../../../actions/types';
import useEnqueueSnackbar from '../../../../../hooks/enqueueSnackbar';
import useCommStatus from '../../../../../hooks/useCommStatus';
import { COMM_STATES } from '../../../../../reducers/comms/networkComms';
import { useGetTableContext } from '../../../../CeligoTable/TableContext';
import useConfirmDialog from '../../../../ConfirmDialog';

export default {
  key: 'removeUserFromAccount',
  useLabel: () => 'Remove user from account',
  Component: () => {
    const { confirmDialog } = useConfirmDialog();
    const dispatch = useDispatch();
    const [enquesnackbar] = useEnqueueSnackbar();
    const {user} = useGetTableContext();
    const { _id: userId, sharedWithUser = {} } = user;
    const deleteFromAccount = useCallback(() => {
      confirmDialog({
        title: 'Confirm delete',
        message: 'Are you sure you want to delete this user?',
        buttons: [
          {
            label: 'Delete',
            onClick: () => {
              dispatch(actions.user.org.users.delete(userId));
            },
          },
          {
            label: 'Cancel',
            color: 'secondary',
          },
        ],
      });
    }, [confirmDialog, dispatch, userId]);

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
      delete: { action: actionTypes.USER_DELETE, resourceId: userId},
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
