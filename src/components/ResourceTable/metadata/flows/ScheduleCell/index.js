import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import CalendarIcon from '../../../../icons/CalendarIcon';
import * as selectors from '../../../../../reducers';
import RemoveMargin from '../RemoveMargin';
import IconButtonWithTooltip from '../../../../IconButtonWithTooltip';

export default function ScheduleCell({_id: flowId}) {
  const history = useHistory();
  const handleClick = useCallback(() => {
    history.push(`flows/${flowId}/schedule`);
  }, [flowId, history]);
  const allowSchedule = useSelector(state =>
    selectors.flowAllowsScheduling(state, flowId)
  );

  if (!allowSchedule) return null;

  return (
    <RemoveMargin>
      <IconButtonWithTooltip
        tooltipProps={{title: 'Change schedule', placement: 'bottom'}}
        onClick={handleClick}>
        <CalendarIcon />
      </IconButtonWithTooltip>
    </RemoveMargin>
  );
}
