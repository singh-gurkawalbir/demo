import React from 'react';
import pick from 'lodash/pick';
import { TimeAgo } from '@celigo/fuse-ui';
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
import { useGetTableContext } from '../../CeligoTable/TableContext';

export default {
  useColumns: () => {
    const actionProps = useGetTableContext() || {};

    let columns = [
      {
        key: 'name',
        heading: 'Name',
        isLoggable: true,
        Value: ({rowData: r}) => {
          const {parentId, childId} = useGetTableContext();

          return (
            <NameCell
              flowId={r._id}
              integrationId={parentId || r._integrationId}
              isIntegrationApp={!!r._connectorId}
              name={r.name}
              description={r.description}
              isFree={r.free}
              childId={childId}
              actionProps={actionProps}
            />
          );
        },
        orderBy: 'name',
      },
      ...(actionProps.showChild ? [{
        heading: actionProps.childHeader || 'App',
        key: 'app',
        isLoggable: true,
        Value: ({rowData: r}) => {
          const {integrationChildren = []} = actionProps;

          return r.childName || integrationChildren.find(i => i.value === r._integrationId)?.label || '';
        },
        orderBy: actionProps.childHeader ? 'childName' : '_integrationId',
      }] : []),
      {
        key: 'errors',
        heading: 'Errors',
        isLoggable: true,
        Value: ({rowData: r}) => (
          <ErrorsCell
            flowId={r._id}
            integrationId={actionProps?.parentId || r._integrationId}
            isIntegrationApp={!!r._connectorId}
            childId={actionProps?.childId}
            />
        ),
        orderBy: 'errors',
      },
      {
        key: 'lastUpdated',
        heading: 'Last updated',
        isLoggable: true,
        Value: ({rowData: r}) => <TimeAgo date={r.lastModified} />,
        orderBy: 'lastModified',
      },
      {
        key: 'lastRun',
        heading: 'Last run',
        isLoggable: true,
        Value: ({rowData: r}) => <StatusCell {...r} />,
        orderBy: 'lastExecutedAtSort',
      },
      {
        key: 'mapping',
        heading: 'Mapping',
        align: 'center',
        isLoggable: true,
        Value: ({rowData: r}) => <MappingCell flowId={r._id} childId={actionProps?.childId} />,
      },
      {
        key: 'schedule',
        heading: 'Schedule',
        align: 'center',
        isLoggable: true,
        Value: ({rowData: r}) => <ScheduleCell flowId={r._id} name={r.name} schedule={r.schedule} actionProps={actionProps} />,
      },
    ];

    // Currently Errors column is not supported for EM1.0
    if (!actionProps || !actionProps.isUserInErrMgtTwoDotZero) {
      columns = columns.filter(column => column.heading !== 'Errors');
    }

    if (actionProps.isIntegrationApp) {
      columns = columns.map(col => pick(col, ['heading', 'key', 'align', 'Value', 'orderBy', 'isLoggable']));

      columns.push(
        {
          key: 'settings',
          heading: 'Settings',
          align: 'center',
          isLoggable: true,
          Value: ({rowData: r}) => <SettingsCell flowId={r._id} name={r.name} actionProps={actionProps} />,
        }
      );
    }

    columns = [
      ...columns,
      {
        key: 'run',
        heading: 'Run',
        isLoggable: true,
        Value: ({rowData: r}) => (
          <RunCell
            flowId={r._id}
            integrationId={actionProps?.parentId || r._integrationId}
            isIntegrationApp={!!r._connectorId}
            childId={actionProps?.childId}
            actionProps={actionProps}
            />
        ),
      },
      {
        key: 'off/On',
        heading: 'Off/On',
        isLoggable: true,
        Value: ({rowData: r}) => (
          <OnOffCell
            flowId={r._id}
            integrationId={r._integrationId}
            isIntegrationApp={!!r._connectorId}
            name={r.name}
            isFree={r.free}
            disabled={r.disabled}
            childId={actionProps.childId}
            actionProps={actionProps}
            tooltip="Off / On"
            />
        ),
      },
    ];

    return columns;
  },

  useRowActions: r => {
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
