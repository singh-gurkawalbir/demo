import { useState, Fragment, useCallback } from 'react';
import FlowSchedule from '../../../../FlowSchedule';
import ModalDialog from '../../../../ModalDialog';

export default {
  title: 'Schedule',
  icon: FlowSchedule,
  component: function Schedule({ resource }) {
    const [showSchedule, setShowSchedule] = useState(true);
    const handleClose = useCallback(() => {
      setShowSchedule(false);
    }, []);

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
      </Fragment>
    );
  },
};
