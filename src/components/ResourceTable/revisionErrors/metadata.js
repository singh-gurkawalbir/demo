import React from 'react';
import ErrorActions from './cells/ErrorActions';

export default {
  useColumns: () => {
    const columns = [{
      key: 'code',
      heading: 'Code',
      Value: ({rowData: r}) => r.code,
    }, {
      key: 'message',
      heading: 'Message',
      Value: ({ rowData: r }) => r.message,
    }, {
      key: 'actions',
      heading: 'Actions',
      Value: ({ rowData: r }) => <ErrorActions errorId={r._id} />,
    }];

    return columns;
  },
};
