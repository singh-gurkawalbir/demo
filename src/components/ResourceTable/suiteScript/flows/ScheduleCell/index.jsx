import React from 'react';
import { useHistory, Link } from 'react-router-dom';
import { Chip } from '@mui/material';
import CalendarIcon from '../../../../icons/CalendarIcon';
import RemoveMargin from '../RemoveMargin';
import IconButtonWithTooltip from '../../../../IconButtonWithTooltip';
import { flowAllowsScheduling, flowType } from '../../../../../utils/suiteScript';

export default function ScheduleCell({flow}) {
  const history = useHistory();
  const allowSchedule = flowAllowsScheduling(flow);

  if (!allowSchedule) {
    const type = flowType(flow);

    if (type !== 'Scheduled') {
      return <Chip size="small" label={type} />;
    }
  }

  return (
    <RemoveMargin>
      <IconButtonWithTooltip
        tooltipProps={{title: 'Change schedule', placement: 'bottom'}}
        component={Link}
        data-test={`flowSchedule-${flow.ioFlowName || flow.name || flow._id}`}
        to={`${history.location.pathname}/${flow._id}/schedule`}
        disabled={!allowSchedule}>
        <CalendarIcon color="secondary" />
      </IconButtonWithTooltip>
    </RemoveMargin>
  );
}
