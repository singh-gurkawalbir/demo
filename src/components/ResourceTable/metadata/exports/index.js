import React from 'react';
import { formatLastModified } from '../../../CeligoTable/util';
import ResourceDrawerLink from '../../../ResourceDrawerLink';
import AuditLogs from '../../actions/AuditLogs';
import Clone from '../../actions/Clone';
import Delete from '../../actions/Delete';
import References from '../../actions/References';
import { ConnectorNameComp } from '..';

export default {
  columns: [
    {
      heading: 'Name',
      value: function ExportDrawerLink(r) {
        return <ResourceDrawerLink resourceType="exports" resource={r} />;
      },
      orderBy: 'name',
    },
    {
      heading: 'Connector',
      value: function ConnectorName(r) {
        return <ConnectorNameComp r={r} />;
      },
    },
    {
      heading: 'Last updated',
      value: r => formatLastModified(r.lastModified),
      orderBy: 'lastModified',
    },
  ],
  rowActions: () => [Clone, AuditLogs, References, Delete],
};
