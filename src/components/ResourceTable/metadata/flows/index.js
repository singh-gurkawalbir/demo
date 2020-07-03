import React from 'react';
import CeligoTimeAgo from '../../../CeligoTimeAgo';
import Detach from '../../actions/Flows/Detach';
import AuditLogs from '../../actions/AuditLogs';
import Clone from '../../actions/Clone';
import Download from '../../actions/Download';
import Delete from '../../actions/Delete';
import References from '../../actions/References';
import NameCell from './NameCell';
import OnOffCell from './OnOffCell';
import RunCell from './RunCell';
import ScheduleCell from './ScheduleCell';
import MappingCell from './MappingCell';
import SettingsCell from './SettingsCell';
import EditCell from '../../actions/Flows/Edit';

export default {
  columns: (empty, actionProps) => {
    let columns = [
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
        heading: 'Last updated',
        value: r => <CeligoTimeAgo date={r.lastModified} />,
        orderBy: 'lastModified',
      },
      {
        heading: 'Last run',
        value: r => <CeligoTimeAgo date={r.lastExecutedAt} />,
        orderBy: 'lastExecutedAt',
      },
      {
        heading: 'Mapping',
        align: 'center',
        value: function Mapping(r) {
          return <MappingCell flowId={r._id} />;
        },
      },
      {
        heading: 'Schedule',
        align: 'center',
        value: function Schedule(r) {
          return <ScheduleCell flowId={r._id} name={r.name} />;
        },
      }
    ];

    if (actionProps.isIntegrationApp) {
      columns.push(
        {
          heading: 'Settings',
          align: 'center',
          value: function Settings(r) {
            return <SettingsCell flowId={r._id} name={r.name} />;
          }
        }
      );
    }

    columns = [
      ...columns,
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
        heading: 'Off/On',
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
      }
    ];

    return columns;
  },

  rowActions: (r, /* actionProps */) => {
    const isIntegrationApp = !!r._connectorId;
    const isStandalone = !r._integrationId;
    // all possible: detach, clone, audit, references, download, delete

    // IAs should exclude these:
    // 'detach','clone','delete','references','download',

    if (isIntegrationApp) {
      return [EditCell, AuditLogs];
    }


    let actions = [EditCell, AuditLogs, References, Download, Clone];
    if (!isStandalone) {
      actions.push(Detach);
    }
    actions = [...actions, Delete];

    return actions;
  },
};
