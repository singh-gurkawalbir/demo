import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import CalendarIcon from '../../../../../icons/CalendarIcon';
import IconButtonWithTooltip from '../../../../../IconButtonWithTooltip';
import { flowAllowsScheduling } from '../../../../../../utils/suiteScript';


export default function ScheduleCell({flow}) {
  const history = useHistory();
  const handleClick = useCallback(() => {
    history.push(`flows/${flow._id}/schedule`);
  }, [flow._id, history]);
  const allowSchedule = flowAllowsScheduling(flow);

  if (!allowSchedule) return null;

  return (
    <IconButtonWithTooltip
      tooltipProps={{title: 'Change schedule', placement: 'bottom'}}
      onClick={handleClick}>
      <CalendarIcon />
    </IconButtonWithTooltip>
  );
}
