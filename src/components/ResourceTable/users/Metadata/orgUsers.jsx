import React from 'react';
import AccessLevel from '../cells/AccessLevel';
import Status from '../cells/Status';
import Notifications from '../cells/Notifications';
import AccessLevelHeader from '../cells/AccessLevelHeader';
import StatusHeader from '../cells/StatusHeader';
import { useGetTableContext } from '../../../CeligoTable/TableContext';

export default {
  columns: (r, {integrationId, isUserInErrMgtTwoDotZero}) => {
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
};
