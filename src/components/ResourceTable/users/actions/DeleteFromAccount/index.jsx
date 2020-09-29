import React, { useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import useConfirmDialog from '../../../../ConfirmDialog';
import actions from '../../../../../actions';
import { COMM_STATES } from '../../../../../reducers/comms/networkComms';
import actionTypes from '../../../../../actions/types';
import useEnqueueSnackbar from '../../../../../hooks/enqueueSnackbar';
import CommStatus from '../../../../CommStatus';

export default {
  label: 'Delete from account',
  component: function DeleteFromAccount({ rowData: user }) {
    const { confirmDialog } = useConfirmDialog();
    const dispatch = useDispatch();
    const [enquesnackbar] = useEnqueueSnackbar();
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

    useEffect(() => deleteFromAccount(), [deleteFromAccount]);

    const commStatusHandler = useCallback(
      objStatus => {
        const {status, message} = objStatus.delete || {};
        const userName = sharedWithUser.name || sharedWithUser.email;

        if (status === COMM_STATES.ERROR) {
          enquesnackbar({
            message: `Deleting user ${userName} is failed due to the error "${message}"`,
            variant: status,
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'center',
            },
          });
        }
      },
      [enquesnackbar, sharedWithUser]
    );

    return (
      <CommStatus
        actionsToMonitor={{
          delete: { action: actionTypes.USER_DELETE, resourceId: userId},
        }}
        autoClearOnComplete
        commStatusHandler={commStatusHandler}
      />
    );
  },
};
