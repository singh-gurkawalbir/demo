import React from 'react';
import AccessLevel from '../cells/AccessLevel';
import EnableUser from '../cells/EnableUser';
import Status from '../cells/Status';
import AccessLevelHeader from '../cells/AccessLevelHeader';
import EnableUserHeader from '../cells/EnableUserHeader';
import StatusHeader from '../cells/StatusHeader';
import { ACCOUNT_IDS } from '../../../../utils/constants';
import ManagePermissions from '../actions/ManagePermissions';
import MakeAccountOwner from '../actions/MakeAccountOwner';
import DeleteFromAccount from '../actions/DeleteFromAccount';

export default {
  columns: () => {
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
        value: (r, { integrationId}) =>
          <EnableUser user={r} integrationId={integrationId} />,
      },
    ];

    return columns;
  },
  rowActions: (user, actionProps) => {
    const { integrationId } = actionProps || {};
    const actions = [];

    if (integrationId && user._id !== ACCOUNT_IDS.OWN) {
      actions.push(ManagePermissions);
    }
    if (!integrationId) {
      actions.push(ManagePermissions);
      if (user.accepted) {
        actions.push(MakeAccountOwner);
      }
      actions.push(DeleteFromAccount);
    }

    return actions;
  },
};
