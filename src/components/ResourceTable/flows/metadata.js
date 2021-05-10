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
import { useGetTableContext } from '../../CeligoTable/TableContext';

export default {
  useColumns: () => {
    const actionProps = useGetTableContext();

    let columns = [
      {
        key: 'name',
        heading: 'Name',
        // TODO: update 'storeId' references to 'childId'
        Value: ({rowData: r}) => {
          const {parentId, storeId} = useGetTableContext();

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
        key: 'app',
        Value: ({rowData: r}) => {
          const {integrationChildren = []} = actionProps;

          return r.childName || integrationChildren.find(i => i.value === r._integrationId)?.label || '';
        },
        orderBy: actionProps.childHeader ? 'childName' : '_integrationId',
      }] : []),
      {
        key: 'errors',
        heading: 'Errors',
        Value: ({rowData: r}) => (
          <ErrorsCell
            flowId={r._id}
            integrationId={actionProps?.parentId || r._integrationId}
            isIntegrationApp={!!r._connectorId}
            childId={actionProps?.storeId}
            />
        ),
        orderBy: 'errors',
      },
      {
        key: 'lastUpdated',
        heading: 'Last updated',
        Value: ({rowData: r}) => <CeligoTimeAgo date={r.lastModified} />,
        orderBy: 'lastModified',
      },
      {
        key: 'lastRun',
        heading: 'Last run',
        Value: ({rowData: r}) => <StatusCell flowId={r._id} integrationId={r._integrationId || 'none'} date={r.lastExecutedAt} actionProps={actionProps} />,
        orderBy: 'lastExecutedAt',
      },
      {
        key: 'mapping',
        heading: 'Mapping',
        align: 'center',
        Value: ({rowData: r}) => <MappingCell flowId={r._id} childId={actionProps?.storeId} />,
      },
      {
        key: 'schedule',
        heading: 'Schedule',
        align: 'center',
        Value: ({rowData: r}) => <ScheduleCell flowId={r._id} name={r.name} actionProps={actionProps} />,
      },
    ];

    // Currently Errors column is not supported for EM1.0
    if (!actionProps || !actionProps.isUserInErrMgtTwoDotZero) {
      columns = columns.filter(column => column.heading !== 'Errors');
    }

    if (actionProps.isIntegrationApp) {
      columns = columns.map(col => pick(col, ['heading', 'key', 'align', 'Value', 'orderBy']));

      columns.push(
        {
          key: 'settings',
          heading: 'Settings',
          align: 'center',
          Value: ({rowData: r}) => <SettingsCell flowId={r._id} name={r.name} actionProps={actionProps} />,
        }
      );
    }

    columns = [
      ...columns,
      {
        key: 'run',
        heading: 'Run',
        Value: ({rowData: r}) => (
          <RunCell
            flowId={r._id}
            integrationId={actionProps?.parentId || r._integrationId}
            isIntegrationApp={!!r._connectorId}
            storeId={actionProps?.storeId}
            actionProps={actionProps}
            />
        ),
      },
      {
        key: 'off/On',
        heading: 'Off/On',
        Value: ({rowData: r}) => (
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
