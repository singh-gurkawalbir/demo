import { useState, Fragment } from 'react';
import Icon from '../../../../icons/CalendarIcon';
import FlowSchedule from '../../../../FlowSchedule';
import ModalDialog from '../../../../ModalDialog';
import IconButtonWithTooltip from '../../../../IconButtonWithTooltip';

export default {
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
        <IconButtonWithTooltip
          tooltipProps={{
            title: 'Schedule',
          }}
          data-test="showFlowSchedule"
          size="small"
          onClick={onScheduleClick}>
          <Icon />
        </IconButtonWithTooltip>
      </Fragment>
    );
  },
};
