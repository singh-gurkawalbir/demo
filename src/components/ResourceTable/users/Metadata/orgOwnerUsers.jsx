import React from 'react';
import AccessLevel from '../cells/AccessLevel';
import EnableUser from '../cells/EnableUser';
import RequireAccountSSO from '../cells/RequireAccountSSO';
import ReinviteUser from '../cells/ReinviteUser';
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
  columns: (r, { integrationId, isUserInErrMgtTwoDotZero, isSSOEnabled }) => {
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
        value: (r, { integrationId, accessLevel}) => {
          if (!r.dismissed) {
            return <EnableUser user={r} integrationId={integrationId} accessLevel={accessLevel} />;
          }

          return <ReinviteUser user={r} />;
        },
      },
      ...((integrationId && isUserInErrMgtTwoDotZero) ? [{
        heading: 'Notifications',
        align: 'center',
        value: (r, { integrationId}) =>
          <Notifications user={r} integrationId={integrationId} />,
      }] : []),
      ...((!integrationId && isSSOEnabled) ? [
        { heading: 'Account SSO linked?',
          value: r => {
            if (!r.sharedWithUser.accountSSOLinked || r.sharedWithUser.accountSSOLinked === 'not_linked') return 'No';

            return 'Yes';
          }},
        { heading: 'Require account SSO?', value: r => <RequireAccountSSO user={r} /> },
      ] : []),
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
