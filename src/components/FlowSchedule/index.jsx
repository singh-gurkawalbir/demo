import React from 'react';
import FlowScheduleForm from './Form';
import FlowScheduleButtons from './Buttons';

const formKey = 'flow-schedule';

export default function FlowSchedule(props) {
  return (
    <>
      <FlowScheduleForm formKey={formKey} {...props} />
      <FlowScheduleButtons formKey={formKey} {...props} />
    </>
  );
}
