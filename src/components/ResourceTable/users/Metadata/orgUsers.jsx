import React from 'react';
import AccessLevel from '../cells/AccessLevel';
import UserStatus from '../cells/UserStatus';
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
      ...((integrationId && isUserInErrMgtTwoDotZero) ? [{
        key: 'notifications',
        heading: 'Notifications',
        align: 'center',
        // it is loggable but what about the links after clicking...they contain an email..need to use requestSanitizer
        isLoggable: true,
        Value: ({rowData: r}) => {
          const {integrationId} = useGetTableContext();

          return <Notifications user={r} integrationId={integrationId} />;
        },
      }] : []),
    ];

    return columns;
  },
};
