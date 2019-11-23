import { useState, Fragment } from 'react';
import { IconButton } from '@material-ui/core';
import Icon from '../../../../icons/CalendarIcon';
import FlowSchedule from '../../../../FlowSchedule';
import ModalDialog from '../../../../ModalDialog';

export default {
  label: 'Schedule',
  component: function Schedule({ resource }) {
    const [showSchedule, setShowSchedule] = useState(false);
    const onScheduleClick = () => {
      setShowSchedule(!showSchedule);
    };

    const handleClose = () => {
      setShowSchedule(false);
    };

    return (
      <Fragment>
        {showSchedule && (
          <ModalDialog show maxWidth={false}>
            <div>Flow Schedule</div>
            <div>
              <FlowSchedule flow={resource} onClose={handleClose} />
            </div>
          </ModalDialog>
        )}
        <IconButton
          data-test="showFlowSchedule"
          size="small"
          onClick={onScheduleClick}>
          <Icon />
        </IconButton>
      </Fragment>
    );
  },
};
