import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { IconButton } from '@material-ui/core';
import CalendarIcon from '../../../../icons/CalendarIcon';
import * as selectors from '../../../../../reducers';
import RemoveMargin from '../RemoveMargin';

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
      <IconButton onClick={handleClick}>
        <CalendarIcon />
      </IconButton>
    </RemoveMargin>
  );
}
