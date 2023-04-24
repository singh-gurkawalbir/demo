import React, { useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CeligoSwitch from '../../../../CeligoSwitch';
import { ACCOUNT_IDS } from '../../../../../constants';
import useConfirmDialog from '../../../../ConfirmDialog';
import actions from '../../../../../actions';
import actionTypes from '../../../../../actions/types';
import { COMM_STATES } from '../../../../../reducers/comms/networkComms';
import useEnqueueSnackbar from '../../../../../hooks/enqueueSnackbar';
import useCommStatus from '../../../../../hooks/useCommStatus';
import Spinner from '../../../../Spinner';
import { selectors } from '../../../../../reducers';

export default function EnableUser({ user }) {
  const { confirmDialog } = useConfirmDialog();
  const { sharedWithUser, disabled, _id: userId, accepted } = user;
  const dispatch = useDispatch();
  const [enquesnackbar] = useEnqueueSnackbar();
  const [isLoading, setLoading] = useState(false);
  const userPreferences = useSelector(state =>
    selectors.userPreferences(state)
  );

  const handleSwitch = useCallback(() => {
    confirmDialog({
      title: `Confirm ${disabled ? 'enable' : 'disable'}`,
      message: `Are you sure you want to ${disabled ? 'enable' : 'disable'} this user?`,
      buttons: [
        {
          label: disabled ? 'Enable' : 'Disable',
          onClick: () => {
            dispatch(actions.user.org.users.disable(userId, disabled, userPreferences.defaultAShareId === userId));
          },
        },
        {
          label: 'Cancel',
          variant: 'text',
        },
      ],
    });
  }, [confirmDialog, disabled, dispatch, userId, userPreferences.defaultAShareId]);

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

      if (status === COMM_STATES.LOADING) {
        setLoading(true);
      } else {
        setLoading(false);
      }
    },
    [enquesnackbar, getStatusMessage]
  );

  const actionsToMonitor = useMemo(() => ({disable: { action: actionTypes.USER.DISABLE, resourceId: userId }}), [userId]);

  useCommStatus({
    actionsToMonitor,
    autoClearOnComplete: true,
    commStatusHandler,
  });

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <CeligoSwitch
      data-test="disableUser"
      disabled={!accepted || userId === ACCOUNT_IDS.OWN}
      checked={!disabled}
      onChange={handleSwitch}
      tooltip="Disable / Enable"
      noPadding
      />
  );
}
