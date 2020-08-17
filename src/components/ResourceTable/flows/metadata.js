import React from 'react';
import CeligoTimeAgo from '../../CeligoTimeAgo';
import AuditLogs from '../commonActions/AuditLogs';
import Clone from '../commonActions/Clone';
import Download from '../commonActions/Download';
import Delete from '../commonActions/Delete';
import References from '../commonActions/References';
import Detach from './actions/Detach';
import Edit from './actions/Edit';
import NameCell from './cells/NameCell';
import OnOffCell from './cells/OnOffCell';
import RunCell from './cells/RunCell';
import ScheduleCell from './cells/ScheduleCell';
import MappingCell from './cells/MappingCell';
import SettingsCell from './cells/SettingsCell';

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
      },
    ];

    if (actionProps.isIntegrationApp) {
      columns.push(
        {
          heading: 'Settings',
          align: 'center',
          value: function Settings(r) {
            return <SettingsCell flowId={r._id} name={r.name} />;
          },
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
              integrationId={actionProps?.parentId || r._integrationId}
              isIntegrationApp={!!r._connectorId}
              storeId={actionProps?.storeId}
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
      },
    ];

    return columns;
  },

  rowActions: r => {
    const isIntegrationApp = !!r._connectorId;
    const isStandalone = !r._integrationId;
    // all possible: detach, clone, audit, references, download, delete

    // IAs should exclude these:
    // 'detach','clone','delete','references','download',

    if (isIntegrationApp) {
      return [Edit, AuditLogs];
    }

    let actions = [Edit, AuditLogs, References, Download, Clone];

    if (!isStandalone) {
      actions.push(Detach);
    }
    actions = [...actions, Delete];

    return actions;
  },
};
