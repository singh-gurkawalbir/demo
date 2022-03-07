import React from 'react';
import UserName from '../commonCells/UserName';
import DateTimeDisplay from '../../DateTimeDisplay';

export default {
  useColumns: () => {
    const columns = [{
      key: 'description',
      heading: 'Description',
      Value: ({rowData: r}) => r.description,
    }, {
      key: 'createdAt',
      heading: 'Date created',
      Value: ({ rowData: r }) => <DateTimeDisplay dateTime={r.createdAt} />,
      orderBy: 'createdAt',
    }, {
      key: 'type',
      heading: 'Type',
      Value: ({ rowData: r }) => r.type,
    }, {
      key: 'status',
      heading: 'Status',
      Value: ({ rowData: r }) => r.status,
    }, {
      key: 'user',
      heading: 'User',
      Value: ({ rowData: r }) => <UserName userId={r._byUserId} />,
    }];

    return columns;
  },
  useRowActions: () => {},
};
