import DetachFlow from '../../actions/Flows/Detach';
import ViewAuditLog from '../../actions/AuditLogs';
import DownloadFlow from '../../actions/Download';
import FieldMappings from '../../actions/Flows/FieldMappings';
import Schedule from '../../actions/Flows/Schedule';
import Run from '../../actions/Flows/Run';
import OnOff from '../../actions/Flows/OnOff';
import ViewReferences from '../../actions/References';
import Delete from '../../actions/Delete';
import { getResourceLink } from '../../../CeligoTable/util';

export default {
  columns: [
    {
      heading: 'Flow Name',
      value: r => getResourceLink('flows', r),
      orderBy: 'name',
    },
    { heading: 'Description', value: r => r && r.description },
    {
      heading: 'Field Mappings',
      value: () => null,
      colAction: [FieldMappings],
    },
    {
      heading: 'Schedule',
      value: () => null,
      colAction: [Schedule],
    },
    {
      heading: 'Run',
      value: () => null,
      colAction: [Run],
    },
    {
      heading: 'Off/On',
      value: () => null,
      colAction: [OnOff],
    },
  ],
  rowActions: [DetachFlow, ViewAuditLog, DownloadFlow, ViewReferences, Delete],
};
