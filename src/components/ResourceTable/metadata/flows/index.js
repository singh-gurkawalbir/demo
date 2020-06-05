import React from 'react';
import { formatLastModified } from '../../../CeligoTable/util';
import Detach from '../../actions/Flows/Detach';
import AuditLogs from '../../actions/AuditLogs';
import Clone from '../../actions/Clone';
import Download from '../../actions/Download';
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
        heading: 'Last run',
        value: r => r.lastExecutedAt && formatLastModified(r.lastExecutedAt),
        orderBy: 'lastExecutedAt',
      },
      {
        heading: 'Mapping',
        value: function Mapping(r) {
          return <MappingCell flowId={r._id} />;
        },
      },
      {
        heading: 'Schedule',
        value: function Schedule(r) {
          return <ScheduleCell {...r} />;
        },
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

  rowActions: (r, /* actionProps */) => {
    const isIntegrationApp = !!r._connectorId;
    const isStandalone = !r._integrationId;
    // all possible: detach, clone, audit, references, download, delete

    // IAs should exclude these:
    // 'detach','clone','delete','references','download',

    if (isIntegrationApp) {
      return [AuditLogs];
    }

    let actions = [];

    if (!isStandalone) {
      actions.push(Detach);
    }

    actions = [...actions, Clone, AuditLogs, References, Download, Delete];

    return actions;
  },
};
