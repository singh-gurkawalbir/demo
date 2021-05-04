import React from 'react';
import NameCell from './NameCell';
import MappingCell from './MappingCell';
import ScheduleCell from './ScheduleCell';
import RunCell from './RunCell';
import OnOffCell from './OnOffCell';
import DeleteCell from './DeleteCell';
import { flowType } from '../../../../utils/suiteScript';

export default {
  columns: (r, actionProps) => [
    {
      heading: 'Name',
      Value: ({rowData: resource}) => (
        <NameCell
          ssLinkedConnectionId={actionProps.ssLinkedConnectionId}
          flow={resource}
        />
      ),
    },
    {
      heading: 'Type',
      Value: ({rowData: resource}) => flowType(resource),
    },
    {
      heading: 'Mapping',
      Value: ({rowData: resource}) => (
        <MappingCell
          ssLinkedConnectionId={actionProps.ssLinkedConnectionId}
          flow={resource}
        />
      ),
    },
    {
      heading: 'Schedule',
      Value: ({rowData: resource}) => (
        <ScheduleCell
          ssLinkedConnectionId={actionProps.ssLinkedConnectionId}
          flow={resource}
        />
      ),
    },
    {
      heading: 'Run',
      Value: ({rowData: resource}) => (
        <RunCell
          ssLinkedConnectionId={actionProps.ssLinkedConnectionId}
          flow={resource}
        />
      ),
    },
    {
      heading: 'Off/On',
      Value: ({rowData: resource}) => (
        <OnOffCell
          ssLinkedConnectionId={actionProps.ssLinkedConnectionId}
          flow={resource}
        />
      ),
    },
    {
      heading: !actionProps.isConnector ? 'Delete' : '',
      Value: ({rowData: resource}) => {
        if (actionProps.isConnector) {
          return null;
        }

        return (
          <DeleteCell
            ssLinkedConnectionId={actionProps.ssLinkedConnectionId}
            flow={resource}
        />
        );
      },
    },
  ],
};
