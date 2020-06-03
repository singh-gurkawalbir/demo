import { formatLastModified } from '../../../CeligoTable/util';
import AuditLogs from '../../actions/AuditLogs';
import Delete from '../../actions/Delete';
import References from '../../actions/References';
import NameCell from './NameCell';
import TypeCell from './TypeCell';
import OnOffCell from './OnOffCell';
import RunCell from './RunCell';
import ScheduleCell from './ScheduleCell';
import MappingCell from './MappingCell';

export default {
  columns: (empty, actionProps) => {
    const columns = [
      {
        heading: 'Name',
        value: function Name(r) {
          return (
            <NameCell
              flowId={r._id}
              integrationId={r._integrationId}
              isIntegrationApp={!!r._connectorId}
              name={r.name}
              description={r.description}
              isFree={r.free}
            />
          );
        },
        orderBy: 'name',
      },
      {
        // Mixed, Scheduled, Realtime, or Data loader
        heading: 'Type',
        value: function Type(r) {
          return <TypeCell flowId={r._id} />;
        },
      },
      {
        heading: 'Last updated',
        value: r => r.lastModified && formatLastModified(r.lastModified),
        orderBy: 'lastModified',
      },
      {
        heading: 'Mapping',
        value: function Mapping(r) {
          return <MappingCell {...r} />;
        },
      },
      {
        heading: 'Schedule',
        value: function Schedule(r) {
          return <ScheduleCell {...r} />;
        },
      },
      {
        heading: 'Last run',
        value: r => r.lastExecutedAt && formatLastModified(r.lastExecutedAt),
        orderBy: 'lastExecutedAt',
      },
      {
        heading: 'Run',
        value: function Name(r) {
          return (
            <RunCell
              flowId={r._id}
              integrationId={r._integrationId}
              isIntegrationApp={!!r._connectorId}
              storeId={actionProps.storeId}
            />
          );
        },
      },
      {
        heading: 'On/off',
        value: function Type(r) {
          return (
            <OnOffCell
              flowId={r._id}
              integrationId={r._integrationId}
              isIntegrationApp={!!r._connectorId}
              name={r.name}
              isFree={r.free}
              disabled={r.disabled}
              storeId={actionProps.storeId}
            />
          );
        },
      },
    ];

    return columns;
  },
  // Mixed, Scheduled, Realtime, or Data loader
  rowActions: (/* r, actionProps */) => {
    const actionsToReturn = [AuditLogs, References, Delete];

    // if (actionProps.type === 'flowBuilder') {
    // }

    return actionsToReturn;
  },
};
