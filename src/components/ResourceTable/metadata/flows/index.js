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
      value: function MappingAction(r) {
        return <FieldMappings.component resource={r} />;
      },
    },
    {
      heading: 'Schedule',
      value: function MappingAction(r) {
        return <Schedule.component resource={r} />;
      },
    },
    {
      heading: 'Run',
      value: function MappingAction(r) {
        return <Run.component resource={r} />;
      },
    },
    {
      heading: 'Off/On',
      value: function MappingAction(r) {
        return <OnOff.component resource={r} />;
      },
    },
  ],
  rowActions: () => [
    DetachFlow,
    ViewAuditLog,
    DownloadFlow,
    ViewReferences,
    Delete,
  ],
};
