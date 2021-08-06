import React from 'react';
import FlowScheduleForm from './Form';
import FlowScheduleButtons from './Buttons';
import LoadResources from '../LoadResources';

export default function FlowSchedule(props) {
  return (
    <LoadResources required resources="flows" >
      <FlowScheduleForm {...props} />
      <FlowScheduleButtons {...props} />
    </LoadResources>
  );
}
