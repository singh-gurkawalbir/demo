import Delete from '../../actions/Delete';
import References from '../../actions/References';
import ConfigureDebugger from '../../actions/Connections/ConfigDebugger';
// eslint-disable-next-line import/no-unresolved
import DownloadDebugLogs from '../../actions/Connections/DownloadDebugLogs';
import AuditLogs from '../../actions/AuditLogs';
import RefreshMetadata from '../../actions/Connections/RefreshMetadata';
import {
  getResourceLink,
  onlineStatus,
  formatLastModified,
  getConnectorName,
} from '../../../CeligoTable/util';
import Deregister from '../../actions/Connections/Deregister';
import { showDownloadLogs, isConnectionEditable } from './util';

export default {
  columns: (r, actionProps) => {
    let columns = [
      {
        heading: 'Name',
        value: (r, actionProps, location) =>
          isConnectionEditable(r, actionProps.integrationId)
            ? getResourceLink('connections', r, location)
            : r.name,
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
        heading: 'Updated on',
        value: r => formatLastModified(r.lastModified),
        orderBy: 'lastModified',
      },
      {
        heading: 'Queue Size',
        // align: 'right',
        value: r => {
          if (!r.queues) return 0;
          const queue = r.queues.find(q => q.name === r._id);

          return queue ? queue.size : 0;
        },
      },
    ];

    if (actionProps.type === 'flowBuilder') {
      columns = columns.filter(col => col.heading !== 'Updated on');
    }

    return columns;
  },
  rowActions: (r, actionProps) => {
    let actionsToReturn = [];

    if (isConnectionEditable(r, actionProps.integrationId)) {
      actionsToReturn = [ConfigureDebugger, AuditLogs];

      if (!actionProps.integrationId) {
        actionsToReturn = [...actionsToReturn, References];
      }

      if (showDownloadLogs(r)) {
        actionsToReturn = [DownloadDebugLogs, ...actionsToReturn];
      }

      if (actionProps.integrationId && !r._connectorId) {
        actionsToReturn = [Deregister, ...actionsToReturn];
      } else if (!r._connectorId && actionProps.type !== 'flowBuilder') {
        actionsToReturn = [...actionsToReturn, Delete];
      }
    } else {
      actionsToReturn = [DownloadDebugLogs, AuditLogs];
    }

    if (r.type === 'netsuite' || r.type === 'salesforce') {
      actionsToReturn = [RefreshMetadata, ...actionsToReturn];
    }

    return actionsToReturn;
  },
};
