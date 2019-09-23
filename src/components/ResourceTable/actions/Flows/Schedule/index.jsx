import { useState, Fragment } from 'react';
import { IconButton } from '@material-ui/core';
import Icon from '../../../../icons/CalendarIcon';
import FlowSchedule from '../../../../FlowSchedule';

export default {
  label: 'Schedule',
  component: function Schedule({ resource }) {
    const [isScheduleShown, showSchedule] = useState(false);
    const onScheduleClick = () => {
      showSchedule(!isScheduleShown);
    };

    const handleClose = () => {
      showSchedule(false);
    };

    return (
      <Fragment>
        {isScheduleShown && (
          <FlowSchedule
            resource={resource}
            title="Flow Schedule"
            onClose={handleClose}
          />
        )}
        <IconButton size="small" onClick={onScheduleClick}>
          <Icon />
        </IconButton>
      </Fragment>
    );
  },
};
