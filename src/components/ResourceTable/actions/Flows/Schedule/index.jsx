import { useState, Fragment } from 'react';
import { IconButton } from '@material-ui/core';
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
          <FlowSchedule
            flow={resource}
            title="Flow Schedule"
            onClose={handleClose}
          />
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
