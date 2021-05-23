import React, { useCallback, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Tooltip } from '@material-ui/core';
import CeligoSwitch from '../../../../CeligoSwitch';
import actions from '../../../../../actions';
import actionTypes from '../../../../../actions/types';
import { COMM_STATES } from '../../../../../reducers/comms/networkComms';
import useEnqueueSnackbar from '../../../../../hooks/enqueueSnackbar';
import useCommStatus from '../../../../../hooks/useCommStatus';
import { ACCOUNT_IDS, ACCOUNT_SSO_STATUS, USER_ACCESS_LEVELS } from '../../../../../utils/constants';

export default function RequireAccountSSO({ user }) {
  const { accountSSORequired, _id: userId, sharedWithUser = {} } = user;
  const dispatch = useDispatch();
  const [enquesnackbar] = useEnqueueSnackbar();
  const [switchInProgress, setSwitchInProgress] = useState(false);

  const handleSwitch = () => {
    const updatedAshareDoc = {
      ...user,
      accountSSORequired: !accountSSORequired,
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
        const statusMessage = `User ${userName} ${!accountSSORequired ? 'requires' : 'does not require'} SSO to sign in`;

        enquesnackbar({
          message: statusMessage,
          variant: status,
        });
      }
      if ([COMM_STATES.SUCCESS, COMM_STATES.ERROR].includes(status)) {
        setSwitchInProgress(false);
      }
    },
    [enquesnackbar, switchInProgress, accountSSORequired, sharedWithUser]
  );

  const actionsToMonitor = useMemo(() => ({update: { action: actionTypes.USER_UPDATE, resourceId: userId }}), [userId]);

  useCommStatus({
    actionsToMonitor,
    autoClearOnComplete: true,
    commStatusHandler,
  });

  const disableSwitch = sharedWithUser.accountSSOLinked === ACCOUNT_SSO_STATUS.LINKED_TO_OTHER_ACCOUNT && !accountSSORequired;

  if (userId === ACCOUNT_IDS.OWN) {
    return null;
  }

  if (disableSwitch) {
    return (
      <Tooltip placement="bottom" data-public title="This user is already linked to another account’s SSO">
        <div>
          <CeligoSwitch
            data-test="ssoRequired"
            disabled
            checked={accountSSORequired}
            onChange={handleSwitch} />
        </div>
      </Tooltip>
    );
  }

  return (
    <CeligoSwitch
      data-test="ssoRequired"
      checked={accountSSORequired}
      onChange={handleSwitch}
      disabled={switchInProgress}
      />
  );
}
