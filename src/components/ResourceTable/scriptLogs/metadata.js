import React from 'react';
import { TimeAgo } from '@celigo/fuse-ui';
import ResourceName from '../../ResourceName';
import TextOverflowCell from '../../TextOverflowCell';
import ViewLogDetail from './actions/ViewLogDetail';

export default {
  useColumns: () => [
    {
      key: 'time',
      heading: 'Time',
      Value: ({rowData: r}) => <TimeAgo date={r.time} />,
    },
    {
      key: 'stepName',
      heading: 'Step name',
      Value: ({rowData: r}) => (
        <ResourceName
          resourceId={r._resourceId}
          />
      ),
    },
    {
      key: 'functionType',
      heading: 'Function type',
      Value: ({rowData: r}) => r.functionType,
    },
    {
      key: 'logLevel',
      heading: 'Log level',
      Value: ({rowData: r}) => r.logLevel,
    },
    {
      key: 'message',
      heading: 'Message',
      width: '25%',
      Value: ({rowData: r}) => (
        <TextOverflowCell
          message={r.message}
            />
      ),
    },
  ],
  useRowActions: () => [ViewLogDetail],
};
