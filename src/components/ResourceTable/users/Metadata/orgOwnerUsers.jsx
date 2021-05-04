import React from 'react';
import AccessLevel from '../cells/AccessLevel';
import EnableUser from '../cells/EnableUser';
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
import { useGetTableContext } from '../../../CeligoTable/TableContext';

export default {
  columns: (r, { integrationId, isUserInErrMgtTwoDotZero }) => {
    const columns = [
      { heading: 'Name', Value: ({rowData: r}) => r.sharedWithUser.name },
      { heading: 'Email', Value: ({rowData: r}) => r.sharedWithUser.email },
      {
        HeaderValue: AccessLevelHeader,
        Value: ({rowData: r}) => {
          const {integrationId} = useGetTableContext();

          return <AccessLevel user={r} integrationId={integrationId} />;
        },
      },
      {
        HeaderValue: StatusHeader,
        Value: ({rowData: r}) => {
          const {integrationId} = useGetTableContext();

          return <Status user={r} integrationId={integrationId} />;
        },
      },
      {
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
        heading: 'Notifications',
        align: 'center',
        Value: ({rowData: r}) => {
          const {integrationId} = useGetTableContext();

          return <Notifications user={r} integrationId={integrationId} />;
        },

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
