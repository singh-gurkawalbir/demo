import React, { useCallback, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Tooltip } from '@material-ui/core';
import CeligoSwitch from '../../../../CeligoSwitch';
import actions from '../../../../../actions';
import actionTypes from '../../../../../actions/types';
import { COMM_STATES } from '../../../../../reducers/comms/networkComms';
import useEnqueueSnackbar from '../../../../../hooks/enqueueSnackbar';
import useCommStatus from '../../../../../hooks/useCommStatus';
import { ACCOUNT_IDS, USER_ACCESS_LEVELS } from '../../../../../constants';
import messageStore from '../../../../../utils/messageStore';

export default function RequireAccountMFA({ user }) {
  const { accountMFARequired, _id: userId, sharedWithUser = {}, accountSSORequired } = user;
  const dispatch = useDispatch();
  const [enquesnackbar] = useEnqueueSnackbar();
  const [switchInProgress, setSwitchInProgress] = useState(false);

  const handleSwitch = () => {
    const updatedAshareDoc = {
      ...user,
      accountMFARequired: !accountMFARequired,
      accessLevel: user.accessLevel === USER_ACCESS_LEVELS.TILE ? undefined : user.accessLevel,
    };

    setSwitchInProgress(true);
    dispatch(actions.user.org.users.update(user._id, updatedAshareDoc));
  };

  const commStatusHandler = useCallback(
    objStatus => {
      if (!switchInProgress) return;
      const { status } = objStatus.update || {};

      if (status === COMM_STATES.SUCCESS) {
        const { name, email } = sharedWithUser || {};
        const userName = name || email;
        const statusMessage = `User ${userName} ${!accountMFARequired ? 'requires' : 'does not require'} MFA to sign in`;

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
      <Tooltip placement="bottom" title={messageStore('ACCOUNT_SSO_OR_MFA_REQUIRED_TOOLTIP')}>
        <div>
          <CeligoSwitch
            data-test="ssoRequired"
            disabled
            checked={accountMFARequired}
            onChange={handleSwitch} />
        </div>
      </Tooltip>
    );
  }

  return (
    <CeligoSwitch
      data-test="mfaRequired"
      checked={accountMFARequired}
      onChange={handleSwitch}
      disabled={switchInProgress}
      />
  );
}
