import React from 'react';
import { useSelector } from 'react-redux';
import { useHistory, Link } from 'react-router-dom';
import CalendarIcon from '../../../../icons/CalendarIcon';
import * as selectors from '../../../../../reducers';
import RemoveMargin from '../RemoveMargin';
import IconButtonWithTooltip from '../../../../IconButtonWithTooltip';

export default function ScheduleCell({flowId, name}) {
  const history = useHistory();
  const allowSchedule = useSelector(state =>
    selectors.flowAllowsScheduling(state, flowId)
  );

  if (!allowSchedule) return null;

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
        <CalendarIcon />
      </IconButtonWithTooltip>
    </RemoveMargin>
  );
}
