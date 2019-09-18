import DetachFlow from '../../actions/Flows/Detach';
import ViewAuditLog from '../../actions/AuditLogs';
import DownloadFlow from '../../actions/Flows/Download';
import FieldMappings from '../../actions/Flows/FieldMappings';
import Schedule from '../../actions/Flows/Schedule';
import Run from '../../actions/Flows/Run';
import OnOff from '../../actions/Flows/OnOff';
import ViewReferences from '../../actions/References';
import Delete from '../../actions/Delete';
import { getResourceLink } from '../util';

export default {
  columns: [
    {
      heading: 'Flow Name',
      value: r => getResourceLink('flows', r),
      orderBy: 'name',
    },
    { heading: 'Description', value: r => r && r.description },
    {
      heading: 'Field Mappings',
      value: () => null,
      action: [FieldMappings],
    },
    {
      heading: 'Schedule',
      value: () => null,
      action: [Schedule],
    },
    {
      heading: 'Run',
      value: () => null,
      action: [Run],
    },
    {
      heading: 'Off/On',
      value: () => null,
      action: [OnOff],
    },
  ],
  actions: r => {
    if (r && (r._integrationId === 'none' || !r._integrationId)) {
      return [ViewAuditLog, DownloadFlow, ViewReferences, Delete];
    }

    return [DetachFlow, ViewAuditLog, DownloadFlow, ViewReferences, Delete];
  },
};
