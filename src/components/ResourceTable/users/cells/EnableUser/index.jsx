import React, { useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import CeligoSwitch from '../../../../CeligoSwitch';
import { ACCOUNT_IDS } from '../../../../../utils/constants';
import useConfirmDialog from '../../../../ConfirmDialog';
import actions from '../../../../../actions';
import actionTypes from '../../../../../actions/types';
import { COMM_STATES } from '../../../../../reducers/comms/networkComms';
import useEnqueueSnackbar from '../../../../../hooks/enqueueSnackbar';
import useCommStatus from '../../../../../hooks/useCommStatus';

export default function EnableUser({ user }) {
  const { confirmDialog } = useConfirmDialog();
  const { sharedWithUser, disabled, _id: userId, accepted } = user;
  const dispatch = useDispatch();
  const [enquesnackbar] = useEnqueueSnackbar();

  const handleSwitch = useCallback(() => {
    confirmDialog({
      title: `Confirm ${disabled ? 'enable' : 'disable'}`,
      message: `Are you sure you want to ${disabled ? 'enable' : 'disable'} this user?`,
      buttons: [
        {
          label: disabled ? 'Enable' : 'Disable',
          onClick: () => {
            dispatch(actions.user.org.users.disable(userId, disabled));
          },
        },
        {
          label: 'Cancel',
          color: 'secondary',
        },
      ],
    });
  }, [confirmDialog, userId, disabled, dispatch]);

  const getStatusMessage = useCallback((status, message) => {
    const { name, email } = sharedWithUser || {};
    const userName = name || email;

    if (status === COMM_STATES.SUCCESS) {
      return `User ${userName} ${disabled ? 'enabled' : 'disabled'} successfully`;
    }

    return `${disabled ? 'Enabling' : 'Disabling'} user ${userName} failed due to the error "${message}"`;
  }, [disabled, sharedWithUser]);

  const commStatusHandler = useCallback(
    objStatus => {
      const {status, message} = objStatus.disable || {};

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

  const actionsToMonitor = useMemo(() => ({disable: { action: actionTypes.USER_DISABLE, resourceId: userId }}), [userId]);

  useCommStatus({
    actionsToMonitor,
    autoClearOnComplete: true,
    commStatusHandler,
  });

  return (
    <CeligoSwitch
      data-test="disableUser"
      disabled={!accepted || userId === ACCOUNT_IDS.OWN}
      checked={!disabled}
      onChange={handleSwitch}
      />
  );
}
