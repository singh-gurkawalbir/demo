import React, { useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { IconButton } from '@material-ui/core';
import FlowSchedule from '../../../../FlowSchedule';
import CalendarIcon from '../../../../icons/CalendarIcon';
import ModalDialog from '../../../../ModalDialog';
import * as selectors from '../../../../../reducers';
import RemoveMargin from '../RemoveMargin';

export default function ScheduleCell(props) {
  const [showSchedule, setShowSchedule] = useState(false);
  const handleClick = useCallback(() => {
    setShowSchedule(!showSchedule);
  }, [showSchedule]);
  const allowSchedule = useSelector(state =>
    selectors.flowAllowsScheduling(state, props._id)
  );

  if (!allowSchedule) return null;

  return (
    <RemoveMargin>
      <IconButton onClick={handleClick}>
        <CalendarIcon />
      </IconButton>
      {showSchedule && (
        <ModalDialog show minWidth="md" onClose={handleClick}>
          <div>Flow schedule</div>
          <div>
            <FlowSchedule flow={props} onClose={handleClick} />
          </div>
        </ModalDialog>
      )}
    </RemoveMargin>
  );
}
