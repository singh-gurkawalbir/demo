import React, { useCallback, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Tooltip } from '@mui/material';
import { Switch } from '@celigo/fuse-ui';
import actions from '../../../../../actions';
import actionTypes from '../../../../../actions/types';
import { COMM_STATES } from '../../../../../reducers/comms/networkComms';
import useEnqueueSnackbar from '../../../../../hooks/enqueueSnackbar';
import useCommStatus from '../../../../../hooks/useCommStatus';
import { ACCOUNT_IDS, USER_ACCESS_LEVELS } from '../../../../../constants';
import { message } from '../../../../../utils/messageStore';

export default function RequireAccountMFA({ user }) {
  const { accountMFARequired, _id: userId, sharedWithUser = {}, accountSSORequired } = user;
  const dispatch = useDispatch();
  const [enquesnackbar] = useEnqueueSnackbar();
  const [switchInProgress, setSwitchInProgress] = useState(false);

  const handleSwitch = useCallback(() => {
    const updatedAshareDoc = {
      ...user,
      accountMFARequired: !accountMFARequired,
      accessLevel: user.accessLevel === USER_ACCESS_LEVELS.TILE ? undefined : user.accessLevel,
    };

    setSwitchInProgress(true);
    dispatch(actions.user.org.users.update(user._id, updatedAshareDoc));
  }, [accountMFARequired, dispatch, user]);

  const commStatusHandler = useCallback(
    objStatus => {
      if (!switchInProgress) return;
      const { status } = objStatus.update || {};

      if (status === COMM_STATES.SUCCESS) {
        const { name, email } = sharedWithUser || {};
        const userName = name || email;
        const statusMessage = `MFA is ${!accountMFARequired ? 'now' : 'no longer'} required for ${userName}.`;

        enquesnackbar({
          message: statusMessage,
          variant: status,
        });
      }
      if ([COMM_STATES.SUCCESS, COMM_STATES.ERROR].includes(status)) {
        setSwitchInProgress(false);
      }
    },
    [enquesnackbar, switchInProgress, accountMFARequired, sharedWithUser]
  );

  const actionsToMonitor = useMemo(() => ({update: { action: actionTypes.USER.UPDATE, resourceId: userId }}), [userId]);

  useCommStatus({
    actionsToMonitor,
    autoClearOnComplete: true,
    commStatusHandler,
  });

  if (userId === ACCOUNT_IDS.OWN) {
    return null;
  }

  if (accountSSORequired) {
    return (
      <Tooltip placement="bottom" title={message.MFA.ACCOUNT_SSO_OR_MFA_REQUIRED_TOOLTIP}>
        <div>
          <Switch
            data-test="ssoRequired"
            disabled
            tooltip="No / Yes"
            checked={accountMFARequired}
            onChange={handleSwitch} />
        </div>
      </Tooltip>
    );
  }

  return (
    <Switch
      data-test="mfaRequired"
      checked={accountMFARequired}
      onChange={handleSwitch}
      disabled={switchInProgress}
      tooltip="No / Yes"
      />
  );
}
