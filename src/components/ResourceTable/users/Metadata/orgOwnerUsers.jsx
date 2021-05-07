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
        Value: ({rowData: r}) => {
          const {integrationId} = useGetTableContext();

          return <AccessLevel user={r} integrationId={integrationId} />;
        },
      },
      {
        key: 'statusHeader',
        HeaderValue: StatusHeader,
        Value: ({rowData: r}) => {
          const {integrationId} = useGetTableContext();

          return <Status user={r} integrationId={integrationId} />;
        },
      },
      {
        key: 'enableUserHeader',
        HeaderValue: EnableUserHeader,
        align: 'center',
        Value: ({rowData: r}) => {
          const {integrationId, accessLevel} = useGetTableContext();

          if (!r.dismissed) {
            return <EnableUser user={r} integrationId={integrationId} accessLevel={accessLevel} />;
          }

          return <ReinviteUser user={r} />;
        },
      },
      ...((integrationId && isUserInErrMgtTwoDotZero) ? [{
        key: 'notifications',
        heading: 'Notifications',
        align: 'center',
        Value: ({rowData: r}) => {
          const {integrationId} = useGetTableContext();

          return <Notifications user={r} integrationId={integrationId} />;
        },

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
  useRowActions: user => {
    const tableContext = useGetTableContext();
    const { integrationId, accessLevel } = tableContext;
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
