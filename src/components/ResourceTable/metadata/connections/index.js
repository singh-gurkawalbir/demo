import React from 'react';
import { ConnectorNameComp } from '..';
import { formatLastModified, onlineStatus } from '../../../CeligoTable/util';
import ConnectionResourceDrawerLink from '../../../ResourceDrawerLink/connection';
import AuditLogs from '../../actions/AuditLogs';
import ConfigureDebugger from '../../actions/Connections/ConfigDebugger';
import OpenDebugger from '../../actions/Connections/OpenDebugger';
import Deregister from '../../actions/Connections/Deregister';
// eslint-disable-next-line import/no-unresolved
import DownloadDebugLogs from '../../actions/Connections/DownloadDebugLogs';
import RefreshMetadata from '../../actions/Connections/RefreshMetadata';
import Revoke from '../../actions/Connections/Revoke';
import Delete from '../../actions/Delete';
import References from '../../actions/References';
import Edit from '../../actions/Edit';

export default {
  columns: (r, actionProps) => {
    let columns = [
      {
        heading: 'Name',
        value: function ConnectionDrawerLink(resource) {
          return (
            <ConnectionResourceDrawerLink
              resource={resource}
              integrationId={actionProps.integrationId}
            />
          );
        },
        orderBy: 'name',
      },
      { heading: 'Status', value: r => onlineStatus(r) },
      {
        heading: 'Type',
        value: function ConnectorName(r) {
          return <ConnectorNameComp r={r} />;
        },
      },
      {
        heading: 'API',
        value: r => {
          if (r.type === 'rest') return r && r.rest && r.rest.baseURI;

          if (r.type === 'http') return r && r.http && r.http.baseURI;

          return null;
        },
      },
      {
        heading: 'Last updated',
        value: r => formatLastModified(r.lastModified),
        orderBy: 'lastModified',
        width: 160,
      },
      {
        heading: 'Queue size',
        // align: 'right',
        value: r => r.queueSize || 0,
        width: 120,
      },
    ];

    if (actionProps.type === 'flowBuilder') {
      columns = columns.filter(col => col.heading !== 'Last updated');
    }

    return columns;
  },
  rowActions: (r, actionProps) => {
    let actionsToReturn = [];

    if (r.debugDate) {
      if (actionProps.type === 'flowBuilder') {
        actionsToReturn = [OpenDebugger];
      } else {
        actionsToReturn = [DownloadDebugLogs];
      }
    }
    actionsToReturn = [ConfigureDebugger, ...actionsToReturn, AuditLogs, References];
    if (actionProps.integrationId && !r._connectorId) {
      actionsToReturn = [...actionsToReturn, Deregister];
    }
    if (r.type === 'netsuite' || r.type === 'salesforce') {
      actionsToReturn = [...actionsToReturn, RefreshMetadata];
    }

    if (
      r.type === 'http' &&
      !!((((r.http || {}).auth || {}).token || {}).revoke || {}).uri
    ) {
      actionsToReturn = [...actionsToReturn, Revoke];
    }
    actionsToReturn = [Edit, ...actionsToReturn];
    if (!actionProps.integrationId && !r._connectorId && actionProps.type !== 'flowBuilder') {
      actionsToReturn = [...actionsToReturn, Delete];
    }

    return actionsToReturn;
  },
};
