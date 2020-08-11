import React from 'react';
import ResourceDrawerLink from '../../ResourceDrawerLink';
import StackSystemToken from '../../StackSystemToken';
import Delete from '../commonActions/Delete';
import References from '../commonActions/References';
import AuditLogs from '../commonActions/AuditLogs';
import GenerateToken from '../commonActions/GenerateToken';
import Edit from '../commonActions/Edit';
import StackShares from './actions/StackShares';
import CeligoTimeAgo from '../../CeligoTimeAgo';

const getSystemToken = stack => <StackSystemToken stackId={stack._id} />;

export default {
  columns: [
    {
      heading: 'Name',
      value: function StacksDrawerLink(r) {
        return <ResourceDrawerLink resourceType="stacks" resource={r} />;
      },
      orderBy: 'name',
    },
    {
      heading: 'Type',
      value: r => r.type,
      orderBy: 'type',
    },
    {
      heading: 'Host',
      value: r => r.server && r.server.hostURI,
    },
    {
      heading: 'Function name',
      value: r => r.lambda && r.lambda.functionName,
    },
    {
      heading: 'Access key ID',
      value: r => r.lambda && r.lambda.accessKeyId,
    },
    {
      heading: 'Last updated',
      value: r => <CeligoTimeAgo date={r.lastModified} />,
      orderBy: 'lastModified',
    },
    {
      heading: 'System token',
      width: '285px',
      value: r => (r.server ? !r.shared && getSystemToken(r) : 'N/A'),
    },
  ],
  rowActions: r => {
    if (!r || !r.shared) {
      return [Edit, AuditLogs, References, GenerateToken, StackShares, Delete];
    }

    return [];
  },
};
