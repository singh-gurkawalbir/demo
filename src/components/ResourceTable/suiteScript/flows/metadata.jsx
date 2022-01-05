import React from 'react';
import NameCell from './NameCell';
import MappingCell from './MappingCell';
import ScheduleCell from './ScheduleCell';
import RunCell from './RunCell';
import OnOffCell from './OnOffCell';
import DeleteCell from './DeleteCell';
import { flowType } from '../../../../utils/suiteScript';
import { useGetTableContext } from '../../../CeligoTable/TableContext';

export default {
  useColumns: () => {
    const tableContext = useGetTableContext();

    return [
      {
        heading: 'Name',
        key: 'name',
        isLoggable: true,
        Value: ({rowData: resource}) => (
          <NameCell
            ssLinkedConnectionId={tableContext.ssLinkedConnectionId}
            flow={resource}
        />
        ),
      },
      {
        key: 'type',
        heading: 'Type',
        isLoggable: true,
        Value: ({rowData: resource}) => flowType(resource),
      },
      {
        key: 'mapping',
        heading: 'Mapping',
        isLoggable: true,
        Value: ({rowData: resource}) => (
          <MappingCell
            ssLinkedConnectionId={tableContext.ssLinkedConnectionId}
            flow={resource}
        />
        ),
      },
      {
        key: 'schedule',
        heading: 'Schedule',
        isLoggable: true,
        Value: ({rowData: resource}) => (
          <ScheduleCell
            ssLinkedConnectionId={tableContext.ssLinkedConnectionId}
            flow={resource}
        />
        ),
      },
      {
        key: 'run',
        heading: 'Run',
        isLoggable: true,
        Value: ({rowData: resource}) => (
          <RunCell
            ssLinkedConnectionId={tableContext.ssLinkedConnectionId}
            flow={resource}
        />
        ),
      },
      {
        key: 'onOff',
        heading: 'Off/On',
        isLoggable: true,
        Value: ({rowData: resource}) => (
          <OnOffCell
            ssLinkedConnectionId={tableContext.ssLinkedConnectionId}
            flow={resource}
        />
        ),
      },
      {
        key: 'delete',
        heading: !tableContext.isConnector ? 'Delete' : '',
        isLoggable: true,
        Value: ({rowData: resource}) => {
          if (tableContext.isConnector) {
            return null;
          }

          return (
            <DeleteCell
              ssLinkedConnectionId={tableContext.ssLinkedConnectionId}
              flow={resource}
        />
          );
        },
      },
    ];
  },
};
