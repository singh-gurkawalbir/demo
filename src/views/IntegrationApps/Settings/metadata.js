import { Link } from 'react-router-dom';
import DetachFlow from '../../../components/ResourceTable/actions/Flows/Detach';
import ViewAuditLog from '../../../components/ResourceTable/actions/AuditLogs';
import DownloadFlow from '../../../components/ResourceTable/actions/Download';
import FieldMappings from '../../../components/ResourceTable/actions/Flows/FieldMappings';
import Schedule from '../../../components/ResourceTable/actions/Flows/Schedule';
import Run from '../../../components/ResourceTable/actions/Flows/Run';
import OnOff from '../../../components/ResourceTable/actions/Flows/OnOff';
import ViewReferences from '../../../components/ResourceTable/actions/References';
import Delete from '../../../components/ResourceTable/actions/Delete';
import MappingDialog from '../../../components/MappingDialog/Mapping';

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
        if (r && r.pageProcessors) {
          return <FieldMappings.component resource={r} />;
        } else if (r && r._importId) {
          return <MappingDialog resourceId={r._importId} />;
        }
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
