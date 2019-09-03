import Delete from '../../actions/Delete';
import References from '../../actions/References';
import ConfigureDebugger from '../../actions/ConfigDebugger';
import DownLoadDebugLogs from '../../actions/DownLoadDebugLogs';
import AuditLogs from '../../actions/AuditLogs';
import RefreshMetadata from '../../actions/RefreshMetadata';
import {
  getResourceLink,
  onlineStatus,
  formatLastModified,
  getConnectorName,
} from '../util';

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
  actions: [
    Delete,
    References,
    ConfigureDebugger,
    DownLoadDebugLogs,
    AuditLogs,
    RefreshMetadata,
  ],
};
