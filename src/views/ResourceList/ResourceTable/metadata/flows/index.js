import DetachFlow from '../../actions/Flows/Detach';
import CloneFlow from '../../actions/Flows/CloneFlow';
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
      image: '<img id="FieldMappings" alt="Field Mappings" />',
    },
    {
      heading: 'Schedule',
      value: () => null,
      action: [Schedule],
      image: '<img id="Schedule" alt="Schedule" />',
    },
    {
      heading: 'Run',
      value: () => null,
      action: [Run],
      image: '<img id="Run" alt="Run" />',
    },
    {
      heading: 'Off/On',
      value: () => null,
      action: [OnOff],
      image: '<img id="OffOn" alt="Off/On" />',
    },
  ],
  actions: [
    DetachFlow,
    CloneFlow,
    ViewAuditLog,
    DownloadFlow,
    ViewReferences,
    Delete,
  ],
};
