import React from 'react';
import ResourceDrawerLink from '../../../ResourceDrawerLink';
import Delete from '../../actions/Delete';
import References from '../../actions/References';
import AuditLogs from '../../actions/AuditLogs';
import StackShares from '../../actions/StackShares';
import StackSystemToken from '../../../StackSystemToken';
import { formatLastModified } from '../../../CeligoTable/util';
import GenerateToken from '../../actions/GenerateToken';
import Edit from '../../actions/Edit';

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
      heading: 'Last updated',
      value: r => formatLastModified(r.lastModified),
      orderBy: 'lastModified',
    },
    {
      heading: 'Access key Id',
      value: r => r.lambda && r.lambda.accessKeyId,
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
  }
};
