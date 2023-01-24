import React from 'react';
import AccessLevel from '../cells/AccessLevel';
import EnableUser from '../cells/EnableUser';
import RequireAccountSSO from '../cells/RequireAccountSSO';
import RequireMFA from '../cells/RequireMFA';
import ReinviteUser from '../cells/ReinviteUser';
import UserStatus from '../cells/UserStatus';
import Notifications from '../cells/Notifications';
import AccessLevelHeader from '../cells/AccessLevelHeader';
import StatusHeader from '../cells/StatusHeader';
import HeaderWithHelpText from '../../commonCells/HeaderWithHelpText';
import { ACCOUNT_IDS, USER_ACCESS_LEVELS, ACCOUNT_SSO_STATUS } from '../../../../constants';
import ManagePermissions from '../actions/ManagePermissions';
import MakeAccountOwner from '../actions/MakeAccountOwner';
import DeleteFromAccount from '../actions/DeleteFromAccount';
import ResetMFA from '../actions/ResetMFA';
import { useGetTableContext } from '../../../CeligoTable/TableContext';

export default {
  useColumns: () => {
    const { integrationId, isUserInErrMgtTwoDotZero, isSSOEnabled } = useGetTableContext();
    const columns = [
      { heading: 'Name', key: 'name', Value: ({rowData: r}) => r.sharedWithUser.name },
      { heading: 'Email', key: 'email', Value: ({rowData: r}) => r.sharedWithUser.email },
      {
        key: 'accessLevelHeader',
        HeaderValue: AccessLevelHeader,
        isLoggable: true,
        Value: ({rowData: r}) => {
          const {integrationId} = useGetTableContext();

          return <AccessLevel user={r} integrationId={integrationId} />;
        },
      },
      {
        key: 'statusHeader',
        HeaderValue: StatusHeader,
        isLoggable: true,
        Value: ({rowData: r}) => {
          const {integrationId} = useGetTableContext();

          return <UserStatus user={r} integrationId={integrationId} />;
        },
      },
      {
        key: 'enableUserHeader',
        HeaderValue: () => <HeaderWithHelpText title="Enable user" helpKey="users.enable" />,
        align: 'center',
        Value: ({rowData: r}) => {
          const {integrationId, accessLevel} = useGetTableContext();

          if (!r.dismissed) {
            return <EnableUser user={r} integrationId={integrationId} accessLevel={accessLevel} />;
          }

          return <ReinviteUser user={r} />;
        },
      },
    ];

    if (integrationId && isUserInErrMgtTwoDotZero) {
      columns.push({
        key: 'notifications',
        heading: 'Notifications',
        align: 'center',
        isLoggable: true,
        Value: ({rowData: r}) => {
          const {integrationId} = useGetTableContext();

          return <Notifications user={r} integrationId={integrationId} />;
        },

      });
    }

    if (!integrationId) {
      if (isSSOEnabled) {
        columns.push({
          key: 'accountSSOLinked',
          isLoggable: true,
          HeaderValue: () => <HeaderWithHelpText title="Account SSO linked?" helpKey="users.accountSSOLinked" />,
          Value: ({rowData: r}) => {
            const { sharedWithUser = {}, _id: userId } = r;

            if (userId === ACCOUNT_IDS.OWN) {
              return null;
            }

            if (!sharedWithUser.accountSSOLinked || sharedWithUser.accountSSOLinked === ACCOUNT_SSO_STATUS.NOT_LINKED) return 'No';

            return 'Yes';
          },
        }, {
          key: 'requireAccountSSO',
          HeaderValue: () => <HeaderWithHelpText title="Require account SSO?" helpKey="users.requireAccountSSO" />,
          // will this redact enqueue snackbar notification
          Value: ({rowData: r}) => <RequireAccountSSO user={r} />,
          align: 'center',
          tooltip: 'No / Yes',
        });
      }
      columns.push({
        key: 'requireMFA',
        isLoggable: true,
        HeaderValue: () => <HeaderWithHelpText title="Require MFA?" helpKey="users.requireAccountMFA" />,
        Value: ({rowData: r}) => <RequireMFA user={r} />,
        align: 'center',
        tooltip: 'No / Yes',
      });
    }

    return columns;
  },
  useRowActions: user => {
    const tableContext = useGetTableContext();
    const { integrationId, accessLevel } = tableContext;
    const { sharedWithUser } = user;
    const actions = [];

    if ([USER_ACCESS_LEVELS.ACCOUNT_ADMIN, USER_ACCESS_LEVELS.ACCOUNT_OWNER].includes(accessLevel) && user._id === ACCOUNT_IDS.OWN) {
      return [];
    }

    if (integrationId && user._id !== ACCOUNT_IDS.OWN) {
      actions.push(ManagePermissions);
    }
    if (!integrationId) {
      actions.push(ManagePermissions);
      if (sharedWithUser?.allowedToResetMFA) {
        actions.push(ResetMFA);
      }
      if (user.accepted && accessLevel === USER_ACCESS_LEVELS.ACCOUNT_OWNER) {
        actions.push(MakeAccountOwner);
      }
      actions.push(DeleteFromAccount);
    }

    return actions;
  },
};
