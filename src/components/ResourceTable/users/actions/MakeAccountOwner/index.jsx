import { useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import actions from '../../../../../actions';
import actionTypes from '../../../../../actions/types';
import useEnqueueSnackbar from '../../../../../hooks/enqueueSnackbar';
import useCommStatus from '../../../../../hooks/useCommStatus';
import { COMM_STATES } from '../../../../../reducers/comms/networkComms';
import useConfirmDialog from '../../../../ConfirmDialog';

const actionsToMonitor = {
  makeOwner: { action: actionTypes.USER_MAKE_OWNER },
};
export default {
  label: 'Make account owner',
  component: function MakeAccountOwner({ rowData: user }) {
    const { confirmDialog } = useConfirmDialog();
    const dispatch = useDispatch();
    const [enquesnackbar] = useEnqueueSnackbar();
    const { name, email } = user.sharedWithUser || {};

    const makeAccountOwner = useCallback(() => {
      confirmDialog({
        title: 'Confirm owner',
        isHtml: true,
        message: 'Are you sure you want to make this user the new account owner?  All owner privileges will be transferred to them, and you will be converted to a manager.',
        buttons: [
          {
            label: 'Make owner',
            onClick: () => {
              dispatch(actions.user.org.users.makeOwner(email));
            },
          },
          {
            label: 'Cancel',
            color: 'secondary',
          },
        ],
      });
    }, [confirmDialog, dispatch, email]);

    useEffect(() => makeAccountOwner(), [makeAccountOwner]);

    const getStatusMessage = useCallback((status, message) => {
      const userName = name || email;

      if (status === COMM_STATES.SUCCESS) {
        return `An Account Ownership invitation has been sent to ${name} (${email}).
        Once accepted, your account will be converted to a regular user account with Manager access.`;
      }

      return `Request to make user ${userName} as account owner is failed due to the error "${message}"`;
    }, [name, email]);

    const commStatusHandler = useCallback(
      objStatus => {
        const {status, message} = objStatus.makeOwner || {};

        if ([COMM_STATES.SUCCESS, COMM_STATES.ERROR].includes(status)) {
          const statusMessage = getStatusMessage(status, message);

          enquesnackbar({
            message: statusMessage,
            variant: status,
          });
        }
      },
      [enquesnackbar, getStatusMessage]
    );

    useCommStatus({
      actionsToMonitor,
      autoClearOnComplete: true,
      commStatusHandler,
    });

    return null;
  },
};
