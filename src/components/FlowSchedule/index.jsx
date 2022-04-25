import React from 'react';
import FlowScheduleForm from './Form';
import FlowScheduleButtons from './Buttons';
import LoadResources from '../LoadResources';

export default function FlowSchedule(props) {
  const { flow } = props;

  return (
    <LoadResources required integrationId={flow._integrationId} resources="flows" >
      <FlowScheduleForm {...props} />
      <FlowScheduleButtons {...props} />
    </LoadResources>
  );
}
