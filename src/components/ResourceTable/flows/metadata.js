import React from 'react';
import pick from 'lodash/pick';
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
import ErrorsCell from './cells/ErrorCell';
import StatusCell from './cells/StatusCell';
import ScheduleCell from './cells/ScheduleCell';
import MappingCell from './cells/MappingCell';
import SettingsCell from './cells/SettingsCell';
import CeligoTimeAgo from '../../CeligoTimeAgo';

export default {
  columns: (empty, actionProps) => {
    let columns = [
      {
        heading: 'Name',
        // TODO: update 'storeId' references to 'childId'
        value: function Name(r, { parentId, storeId }) {
          return (
            <NameCell
              flowId={r._id}
              integrationId={parentId || r._integrationId}
              isIntegrationApp={!!r._connectorId}
              name={r.name}
              description={r.description}
              isFree={r.free}
              childId={storeId}
              actionProps={actionProps}
            />
          );
        },
        orderBy: 'name',
      },
      ...(actionProps.showChild ? [{
        heading: actionProps.childHeader || 'App',
        value: function ChildName(r, actionProps) {
          const {integrationChildren = []} = actionProps;

          return r.childName || integrationChildren.find(i => i.value === r._integrationId)?.label || '';
        },
        orderBy: actionProps.childHeader ? 'childName' : '_integrationId',
      }] : []),
      {
        heading: 'Errors',
        value: function Errors(r) {
          return (
            <ErrorsCell
              flowId={r._id}
              integrationId={actionProps?.parentId || r._integrationId}
              isIntegrationApp={!!r._connectorId}
              childId={actionProps?.storeId}
            />
          );
        },
        orderBy: 'errors',
      },
      {
        heading: 'Last updated',
        value: r => <CeligoTimeAgo date={r.lastModified} />,
        orderBy: 'lastModified',
      },
      {
        heading: 'Last run',
        value: r => <StatusCell flowId={r._id} integrationId={r._integrationId || 'none'} date={r.lastExecutedAt} actionProps={actionProps} />,
        orderBy: 'lastExecutedAt',
      },
      {
        heading: 'Mapping',
        align: 'center',
        value: function Mapping(r) {
          return <MappingCell flowId={r._id} childId={actionProps?.storeId} />;
        },
      },
      {
        heading: 'Schedule',
        align: 'center',
        value: function Schedule(r) {
          return <ScheduleCell flowId={r._id} name={r.name} actionProps={actionProps} />;
        },
      },
    ];

    // Currently Errors column is not supported for EM1.0
    if (!actionProps || !actionProps.isUserInErrMgtTwoDotZero) {
      columns = columns.filter(column => column.heading !== 'Errors');
    }

    if (actionProps.isIntegrationApp) {
      columns = columns.map(col => pick(col, ['heading', 'align', 'value', 'orderBy']));

      columns.push(
        {
          heading: 'Settings',
          align: 'center',
          value: function Settings(r) {
            return <SettingsCell flowId={r._id} name={r.name} actionProps={actionProps} />;
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
              actionProps={actionProps}
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
              actionProps={actionProps}
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
