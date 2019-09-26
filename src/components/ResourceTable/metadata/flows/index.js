import { Link } from 'react-router-dom';
import DetachFlow from '../../actions/Flows/Detach';
import ViewAuditLog from '../../actions/AuditLogs';
import DownloadFlow from '../../actions/Download';
import FieldMappings from '../../actions/Flows/FieldMappings';
import Schedule from '../../actions/Flows/Schedule';
import Run from '../../actions/Flows/Run';
import OnOff from '../../actions/Flows/OnOff';
import ViewReferences from '../../actions/References';
import Delete from '../../actions/Delete';

export default {
  columns: [
    {
      heading: 'Flow Name',
      value: function FlowBuilderLink(r) {
        return <Link to={`/pg/flowBuilder/${r._id}`}>{r.name || r._id}</Link>;
      },
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
      value: function ScheduleAction(r) {
        return <Schedule.component resource={r} />;
      },
    },
    {
      heading: 'Run',
      value: function RunAction(r) {
        return <Run.component resource={r} />;
      },
    },
    {
      heading: 'Off/On',
      value: function OffOnAction(r) {
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
