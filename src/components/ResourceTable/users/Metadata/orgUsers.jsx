import React from 'react';
import AccessLevel from '../cells/AccessLevel';
import Status from '../cells/Status';
import Notifications from '../cells/Notifications';
import AccessLevelHeader from '../cells/AccessLevelHeader';
import StatusHeader from '../cells/StatusHeader';
import { useGetTableContext } from '../../../CeligoTable/TableContext';

export default {
  useColumns: () => {
    const {integrationId, isUserInErrMgtTwoDotZero} = useGetTableContext();
    const columns = [
      {
        key: 'name',
        heading: 'Name',
        Value: ({rowData: r}) => r.sharedWithUser.name },
      {
        key: 'email',
        heading: 'Email',
        Value: ({rowData: r}) => r.sharedWithUser.email },
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
      ...((integrationId && isUserInErrMgtTwoDotZero) ? [{
        key: 'notifications',
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
