import { useSelector } from 'react-redux';
import { IconButton } from '@material-ui/core';
import { useState, Fragment, useCallback } from 'react';
import FlowSchedule from '../../../../FlowSchedule';
import CalendarIcon from '../../../../icons/CalendarIcon';
import ModalDialog from '../../../../ModalDialog';
import * as selectors from '../../../../../reducers';

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
    <Fragment>
      <IconButton onClick={handleClick}>
        <CalendarIcon />
      </IconButton>
      {showSchedule && (
        <ModalDialog show maxWidth={false}>
          <div>Flow schedule</div>
          <div>
            <FlowSchedule flow={props} onClose={handleClick} />
          </div>
        </ModalDialog>
      )}
    </Fragment>
  );
}
