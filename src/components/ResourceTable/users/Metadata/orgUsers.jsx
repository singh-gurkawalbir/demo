import React from 'react';
import AccessLevel from '../cells/AccessLevel';
import Status from '../cells/Status';
import Notifications from '../cells/Notifications';
import AccessLevelHeader from '../cells/AccessLevelHeader';
import StatusHeader from '../cells/StatusHeader';

export default {
  columns: (r, {integrationId}) => {
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
      ...(integrationId ? [{
        heading: 'Notifications',
        value: (r, { integrationId}) =>
          <Notifications user={r} integrationId={integrationId} />,
      }] : []),
    ];

    return columns;
  },
};
