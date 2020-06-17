import React from 'react';
import NameCell from './NameCell';
import MappingCell from './MappingCell';
import ScheduleCell from './ScheduleCell';
import RunCell from './RunCell';
import OnOffCell from './OnOffCell';
import DeleteCell from './DeleteCell';
import { flowType } from '../../../../../utils/suiteScript';

export default {
  columns: (r, actionProps) => [
    {
      heading: 'Name',
      value: resource => (
        <NameCell
          ssLinkedConnectionId={actionProps.ssLinkedConnectionId}
          flow={resource}
        />
      )
    },
    {
      heading: 'Type',
      value: resource => flowType(resource)
    },
    {
      heading: 'Mapping',
      value: resource => (
        <MappingCell
          ssLinkedConnectionId={actionProps.ssLinkedConnectionId}
          flow={resource}
        />
      )
    },
    {
      heading: 'Schedule',
      value: resource => (
        <ScheduleCell
          ssLinkedConnectionId={actionProps.ssLinkedConnectionId}
          flow={resource}
        />
      )
    },
    {
      heading: 'Run',
      value: resource => (
        <RunCell
          ssLinkedConnectionId={actionProps.ssLinkedConnectionId}
          flow={resource}
        />
      )
    },
    {
      heading: 'Off/On',
      value: resource => (
        <OnOffCell
          ssLinkedConnectionId={actionProps.ssLinkedConnectionId}
          flow={resource}
        />
      )
    },
    {
      heading: 'Delete',
      value: resource => (
        <DeleteCell
          ssLinkedConnectionId={actionProps.ssLinkedConnectionId}
          flow={resource}
        />
      )
    }
  ],
};
