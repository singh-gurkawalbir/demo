import React from 'react';
import AccessLevel from '../cells/AccessLevel';
import EnableUser from '../cells/EnableUser';
import Status from '../cells/Status';
import Notifications from '../cells/Notifications';
import AccessLevelHeader from '../cells/AccessLevelHeader';
import EnableUserHeader from '../cells/EnableUserHeader';
import StatusHeader from '../cells/StatusHeader';
import { ACCOUNT_IDS, USER_ACCESS_LEVELS } from '../../../../utils/constants';
import ManagePermissions from '../actions/ManagePermissions';
import MakeAccountOwner from '../actions/MakeAccountOwner';
import DeleteFromAccount from '../actions/DeleteFromAccount';

export default {
  columns: (r, { integrationId, isUserInErrMgtTwoDotZero }) => {
    const columns = [
      { heading: 'Name', value: r => r.sharedWithUser.name },
      { heading: 'Email', value: r => r.sharedWithUser.email },
      {
        headerValue: AccessLevelHeader,
        value: (r, { integrationId}) =>
          <AccessLevel user={r} integrationId={integrationId} />,
      },
      {
        headerValue: StatusHeader,
        value: (r, { integrationId}) =>
          <Status user={r} integrationId={integrationId} />,
      },
      {
        headerValue: EnableUserHeader,
        align: 'center',
        value: (r, { integrationId, accessLevel}) =>
          <EnableUser user={r} integrationId={integrationId} accessLevel={accessLevel} />,
      },
      ...((integrationId && isUserInErrMgtTwoDotZero) ? [{
        heading: 'Notifications',
        align: 'center',
        value: (r, { integrationId}) =>
          <Notifications user={r} integrationId={integrationId} />,
      }] : []),
    ];

    return columns;
  },
  rowActions: (user, actionProps = {}) => {
    const { integrationId, accessLevel } = actionProps;
    const actions = [];

    if ([USER_ACCESS_LEVELS.ACCOUNT_ADMIN, USER_ACCESS_LEVELS.ACCOUNT_OWNER].includes(accessLevel) && user._id === ACCOUNT_IDS.OWN) {
      return [];
    }

    if (integrationId && user._id !== ACCOUNT_IDS.OWN) {
      actions.push(ManagePermissions);
    }
    if (!integrationId) {
      actions.push(ManagePermissions);
      if (user.accepted && accessLevel === USER_ACCESS_LEVELS.ACCOUNT_OWNER) {
        actions.push(MakeAccountOwner);
      }
      actions.push(DeleteFromAccount);
    }

    return actions;
  },
};
