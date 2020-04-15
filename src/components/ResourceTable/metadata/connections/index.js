import Delete from '../../actions/Delete';
import Revoke from '../../actions/Connections/Revoke';
import References from '../../actions/References';
import ConfigureDebugger from '../../actions/Connections/ConfigDebugger';
// eslint-disable-next-line import/no-unresolved
import DownloadDebugLogs from '../../actions/Connections/DownloadDebugLogs';
import OpenDebugger from '../../actions/Connections/OpenDebugger';
import AuditLogs from '../../actions/AuditLogs';
import RefreshMetadata from '../../actions/Connections/RefreshMetadata';
import {
  onlineStatus,
  formatLastModified,
  getConnectorName,
} from '../../../CeligoTable/util';
import Deregister from '../../actions/Connections/Deregister';
import { showDownloadLogs } from './util';
import ConnectionResourceDrawerLink from '../../../ResourceDrawerLink/connection';

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
      { heading: 'Type', value: r => getConnectorName(r) },
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
      },
      {
        heading: 'Queue Size',
        // align: 'right',
        value: r => r.queueSize || 0,
      },
    ];

    if (actionProps.type === 'flowBuilder') {
      columns = columns.filter(col => col.heading !== 'Last updated');
    }

    return columns;
  },
  rowActions: (r, actionProps) => {
    let actionsToReturn = [AuditLogs];

    // TODO: pass some attribute to restrict accessToken api call
    actionsToReturn = [...actionsToReturn, References];

    if (actionProps.type === 'flowBuilder') {
      actionsToReturn = [OpenDebugger, ...actionsToReturn];
    } else {
      actionsToReturn = [ConfigureDebugger, ...actionsToReturn];

      if (showDownloadLogs(r)) {
        actionsToReturn = [DownloadDebugLogs, ...actionsToReturn];
      }
    }

    if (actionProps.integrationId && !r._connectorId) {
      actionsToReturn = [Deregister, ...actionsToReturn];
    } else if (!r._connectorId && actionProps.type !== 'flowBuilder') {
      actionsToReturn = [...actionsToReturn, Delete];
    }

    if (r.type === 'netsuite' || r.type === 'salesforce') {
      actionsToReturn = [RefreshMetadata, ...actionsToReturn];
    }

    if (
      r.type === 'http' &&
      !!((((r.http || {}).auth || {}).token || {}).revoke || {}).uri
    ) {
      actionsToReturn = [Revoke, ...actionsToReturn];
    }

    return actionsToReturn;
  },
};
