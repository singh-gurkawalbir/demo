import React, { useState, useCallback } from 'react';
import FlowSchedule from '../../../../FlowSchedule';
import CalendarIcon from '../../../../icons/CalendarIcon';
import ModalDialog from '../../../../ModalDialog';

export default {
  label: 'Schedule',
  icon: CalendarIcon,
  component: function Schedule({ rowData = {} }) {
    const [showSchedule, setShowSchedule] = useState(true);
    const handleClose = useCallback(() => {
      setShowSchedule(false);
    }, []);

    return (
      <>
        {showSchedule && (
          <ModalDialog show maxWidth={false}>
            <div>Flow Schedule</div>
            <div>
              <FlowSchedule flow={rowData} onClose={handleClose} />
            </div>
          </ModalDialog>
        )}
      </>
    );
  },
};
