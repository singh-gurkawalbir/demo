import React from 'react';
import FlowScheduleForm from './Form';
import FlowScheduleButtons from './Buttons';
import LoadResources from '../LoadResources';

const formKey = 'flow-schedule';

export default function FlowSchedule(props) {
  return (
    <LoadResources required resources="flows" >
      <FlowScheduleForm formKey={formKey} {...props} />
      <FlowScheduleButtons formKey={formKey} {...props} />
    </LoadResources>
  );
}
