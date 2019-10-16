import { Link } from 'react-router-dom';
import ViewAuditLog from '../../../components/ResourceTable/actions/AuditLogs';
import FieldMappings from '../../../components/ResourceTable/actions/Flows/FieldMappings';
import Schedule from '../../../components/ResourceTable/actions/Flows/Schedule';
import Run from '../../../components/ResourceTable/actions/Flows/Run';
import OnOff from '../../../components/ResourceTable/actions/Flows/OnOff';
import MappingDialog from '../../../components/MappingDialog/Mapping';
import Description from './Actions/Description';

export default {
  columns: (sectionContext, actionProps) => {
    const { hasNSInternalIdLookup, showFlowSettings, showMatchRuleEngine } =
      actionProps && actionProps.rest;
    const columnData = [];

    columnData.push({
      heading: 'Flow Name',
      value: function FlowBuilderLink(r) {
        return <Link to={`/pg/flowBuilder/${r._id}`}>{r.name || r._id}</Link>;
      },
      orderBy: 'name',
    });
    columnData.push({
      heading: 'Description',
      value: function ScheduleAction(r) {
        return <Description.component resource={r} />;
      },
    });

    if (hasNSInternalIdLookup) {
      columnData.push({
        heading: 'NetSuite Internal Id Lookup',
        value: function ScheduleAction(r) {
          return <Schedule.component resource={r} />;
        },
      });
    }

    if (showFlowSettings) {
      columnData.push({
        heading: 'Settings',
        value: function ScheduleAction(r) {
          return <Schedule.component resource={r} />;
        },
      });
    }

    columnData.push({
      heading: 'Field Mappings',
      value: function MappingAction(r) {
        if (r && r.pageProcessors) {
          return <FieldMappings.component resource={r} />;
        } else if (r && r._importId) {
          return <MappingDialog resourceId={r._importId} />;
        }
      },
    });

    if (showMatchRuleEngine) {
      columnData.push({
        heading: 'Matching Rule Engine',
        value: function ScheduleAction(r) {
          return <Schedule.component resource={r} />;
        },
      });
    }

    columnData.push({
      heading: 'Schedule',
      value: function ScheduleAction(r) {
        return <Schedule.component resource={r} />;
      },
    });
    columnData.push({
      heading: 'Run',
      value: function RunAction(r) {
        return <Run.component resource={r} />;
      },
    });
    columnData.push({
      heading: 'Off/On',
      value: function OffOnAction(r) {
        return <OnOff.component resource={r} />;
      },
    });
    columnData.push({
      heading: 'Audit Log',
      value: function AuditLog(r) {
        return <ViewAuditLog.component resource={r} />;
      },
    });

    return columnData;
  },
  rowActions: () => [],
};
