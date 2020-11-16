import React from 'react';
import { useHistory, Link } from 'react-router-dom';
import { Chip } from '@material-ui/core';
import CalendarIcon from '../../../../icons/CalendarIcon';
import RemoveMargin from '../RemoveMargin';
import IconButtonWithTooltip from '../../../../IconButtonWithTooltip';

export default function ScheduleCell({flowId, name, actionProps}) {
  const history = useHistory();
  const { allowSchedule, type } = (actionProps.flowAttributes[flowId] || {});

  if (!allowSchedule) {
    if (type !== 'Scheduled') {
      return <Chip size="small" label={type} />;
    }

    return null;
  }

  return (
    <RemoveMargin>
      <IconButtonWithTooltip
        tooltipProps={{
          title: 'Change schedule',
          placement: 'bottom',
        }}
        // disabled={!allowSchedule}
        component={Link}
        data-test={`flowSchedule-${name}`}
        to={`${history.location.pathname}/${flowId}/schedule`}>
        <CalendarIcon color="secondary" />
      </IconButtonWithTooltip>
    </RemoveMargin>
  );
}
