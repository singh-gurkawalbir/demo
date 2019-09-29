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
import { showDownloadLogs } from './util';

export default {
  columns: [
    {
      heading: 'Name',
      value: r => getResourceLink('connections', r),
      orderBy: 'name',
    },
    { heading: 'Status', value: r => onlineStatus(r) },
    { heading: 'Connector', value: r => getConnectorName(r) },
    {
      heading: 'API',
      value: r => {
        if (r.type === 'rest') return r.rest.baseURI;

        if (r.type === 'http') return r.http.baseURI;

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
  ],
  rowActions: (r, actionProps) => {
    const actionsToReturn = [ConfigureDebugger, AuditLogs, References];

    if (showDownloadLogs(r)) {
      actionsToReturn.unshift(DownloadDebugLogs);
    }

    if (r.type === 'netsuite' || r.type === 'salesforce') {
      actionsToReturn.unshift(RefreshMetadata);
    }

    if (actionProps.integrationId) {
      actionsToReturn.unshift(Deregister);
    } else {
      actionsToReturn.push(Delete);
    }

    return actionsToReturn;
  },
};
