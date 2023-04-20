import React from 'react';
import { TimeAgo } from '@celigo/fuse-ui';
import ResourceDrawerLink from '../../ResourceDrawerLink';
import StackSystemToken from '../../StackSystemToken';
import Delete from '../commonActions/Delete';
import References from '../commonActions/References';
import AuditLogs from '../commonActions/AuditLogs';
import GenerateToken from '../commonActions/GenerateToken';
import Edit from '../commonActions/Edit';
import StackShares from './actions/StackShares';

const getSystemToken = stack => <StackSystemToken stackId={stack._id} />;

export default {
  useColumns: () => [
    {
      key: 'name',
      heading: 'Name',
      isLoggable: true,
      Value: ({rowData: r}) => <ResourceDrawerLink resourceType="stacks" resource={r} />,
      orderBy: 'name',
    },
    {
      key: 'type',
      heading: 'Type',
      isLoggable: true,
      Value: ({rowData: r}) => r.type,
      orderBy: 'type',
    },
    {
      key: 'host',
      heading: 'Host',
      isLoggable: true,
      Value: ({rowData: r}) => r.server && r.server.hostURI,
    },
    {
      key: 'functionName',
      heading: 'Function name',
      isLoggable: true,
      Value: ({rowData: r}) => r.lambda && r.lambda.functionName,
    },
    {
      key: 'accessKeyId',
      heading: 'Access key ID',
      Value: ({rowData: r}) => r.lambda && r.lambda.accessKeyId,
    },
    {
      key: 'lastUpdated',
      heading: 'Last updated',
      isLoggable: true,
      Value: ({rowData: r}) => <TimeAgo date={r.lastModified} />,
      orderBy: 'lastModified',
    },
    {
      key: 'systemToken',
      heading: 'System token',
      width: '285px',
      Value: ({rowData: r}) => (r.server ? !r.shared && getSystemToken(r) : 'N/A'),
    },
  ],
  useRowActions: r => {
    if (!r || !r.shared) {
      return [Edit, AuditLogs, References, GenerateToken, StackShares, Delete];
    }

    return [];
  },
};
