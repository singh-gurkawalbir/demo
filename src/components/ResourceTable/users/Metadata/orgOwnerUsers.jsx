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
import HeaderWithHelpText from '../../commonCells/HeaderWithHelpText';
import { ACCOUNT_IDS, USER_ACCESS_LEVELS, ACCOUNT_SSO_STATUS } from '../../../../utils/constants';
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
        {
          headerValue: () => <HeaderWithHelpText title="Account SSO linked?" helpKey="users.accountSSOLinked" />,
          value: r => {
            const { sharedWithUser = {}, _id: userId } = r;

            if (userId === ACCOUNT_IDS.OWN) {
              return null;
            }

            if (!sharedWithUser.accountSSOLinked || sharedWithUser.accountSSOLinked === ACCOUNT_SSO_STATUS.NOT_LINKED) return 'No';

            return 'Yes';
          }},
        {
          headerValue: () => <HeaderWithHelpText title="Require account SSO?" helpKey="users.requireAccountSSO" />,
          value: r => <RequireAccountSSO user={r} />,
          align: 'center',
        },
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
