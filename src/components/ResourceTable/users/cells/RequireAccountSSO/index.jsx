import React, { useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import CeligoSwitch from '../../../../CeligoSwitch';
import actions from '../../../../../actions';
import actionTypes from '../../../../../actions/types';
import { COMM_STATES } from '../../../../../reducers/comms/networkComms';
import useEnqueueSnackbar from '../../../../../hooks/enqueueSnackbar';
import useCommStatus from '../../../../../hooks/useCommStatus';

export default function RequireAccountSSO({ user }) {
  const { accountSSORequired, _id, sharedWithUser = {} } = user;
  const dispatch = useDispatch();
  const [enquesnackbar] = useEnqueueSnackbar();

  const handleSwitch = () => {
    const updatedAshareDoc = {
      ...user,
      accountSSORequired: !accountSSORequired,
    };

    dispatch(actions.user.org.users.update(user._id, updatedAshareDoc));
  };

  const commStatusHandler = useCallback(
    objStatus => {
      const { status } = objStatus.update || {};

      if (status === COMM_STATES.SUCCESS) {
        const statusMessage = 'Updated successfully';

        enquesnackbar({
          message: statusMessage,
          variant: status,
        });
      }
    },
    [enquesnackbar]
  );

  const actionsToMonitor = useMemo(() => ({update: { action: actionTypes.USER_UPDATE, resourceId: _id }}), [_id]);

  useCommStatus({
    actionsToMonitor,
    autoClearOnComplete: true,
    commStatusHandler,
  });

  return (
    <CeligoSwitch
      data-test="ssoRequired"
      disabled={sharedWithUser.accountSSOLinked === 'other_account' && !accountSSORequired}
      checked={accountSSORequired}
      onChange={handleSwitch}
      />
  );
}
