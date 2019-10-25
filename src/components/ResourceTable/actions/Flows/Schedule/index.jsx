import { useState, Fragment } from 'react';
import { IconButton, Dialog, DialogTitle, Typography } from '@material-ui/core';
import Icon from '../../../../icons/CalendarIcon';
import FlowSchedule from '../../../../FlowSchedule';

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
          <Dialog open maxWidth={false}>
            <DialogTitle disableTypography>
              <Typography variant="h6">Flow Schedule</Typography>
            </DialogTitle>
            <FlowSchedule flow={resource} onClose={handleClose} />
          </Dialog>
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
