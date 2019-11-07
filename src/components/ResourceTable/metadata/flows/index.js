import { Link } from 'react-router-dom';
import DetachFlow from '../../actions/Flows/Detach';
import ViewAuditLog from '../../actions/AuditLogs';
import DownloadFlow from '../../actions/Download';
import FieldMappings from '../../actions/Flows/FieldMappings';
import Schedule from '../../actions/Flows/Schedule';
import Run from '../../actions/Flows/Run';
import OnOff from '../../../../components/OnOff';
import ViewReferences from '../../actions/References';
import Delete from '../../actions/Delete';
import MappingDialog from '../../../MappingDialog/Mapping';
import Clone from '../../actions/Clone';

export default {
  columns: [
    {
      heading: 'Flow Name',
      value: function FlowBuilderLink(r) {
        return (
          <Link
            to={`/pg/integrations/${r._integrationId || 'none'}/flowBuilder/${
              r._id
            }`}>
            {r.name || r._id}
          </Link>
        );
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
        if (r && r.isRealtime) {
          return 'Realtime';
        } else if (r && r.isSimpleImport) {
          return 'Data Loader';
        } else if (r && r.showScheduleIcon) {
          return <Schedule.component resource={r} />;
        }

        return '';
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
    Clone,
    ViewAuditLog,
    DownloadFlow,
    ViewReferences,
    Delete,
  ],
};
