import React from 'react';
import AccessLevel from '../cells/AccessLevel';
import Status from '../cells/Status';
import Notifications from '../cells/Notifications';
import AccessLevelHeader from '../cells/AccessLevelHeader';
import StatusHeader from '../cells/StatusHeader';
import ManageNotifications from '../actions/ManageNotifications';

export default {
  columns: (r, {integrationId, isUserInErrMgtTwoDotZero}) => {
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
      ...((integrationId && isUserInErrMgtTwoDotZero) ? [{
        heading: 'Notifications',
        value: (r, { integrationId}) =>
          <Notifications user={r} integrationId={integrationId} />,
      }] : []),
    ];

    return columns;
  },
  rowActions: (user, actionProps) => {
    const { integrationId, isUserInErrMgtTwoDotZero, hasManageIntegrationAccess, loggedInUserId } = actionProps || {};

    // org users only have integration level actions incase of EM2.0
    // TODO @Raghu: have a useHasActions function to decide when to show actions column
    if (!integrationId || !isUserInErrMgtTwoDotZero || user.sharedWithUser._id === loggedInUserId) return [];
    // Only owner/manage users can have manageNotifications action
    if (hasManageIntegrationAccess) {
      return [ManageNotifications];
    }

    return [];
  },
};
