import React from 'react';
import { useSelector } from 'react-redux';
import Icon from '../../../../components/icons/CalendarIcon';
import ModalDialog from '../../../../components/ModalDialog';
import * as selectors from '../../../../reducers';
import FlowSchedule from '../../../../components/FlowSchedule';

function ScheduleDialog({
  flowId,
  isViewMode,
  resource,
  open,
  onClose,
  schedule,
  index,
}) {
  const resourceId = resource._id;
  const flow = useSelector(state => selectors.resource(state, 'flows', flowId));
  const pg = { _exportId: resourceId, schedule };

  return (
    <ModalDialog
      show={open}
      onClose={onClose}
      minWidth="md"
      maxWidth="md"
      disabled={isViewMode}>
      <div>Flow schedule override</div>
      <div>
        <FlowSchedule flow={flow} onClose={onClose} pg={pg} index={index} />
      </div>
    </ModalDialog>
  );
}

export default {
  // used to create data-test attribute and component key. Should be unique across FB actions.
  name: 'exportSchedule',
  position: 'middle',
  Icon,
  helpKey: 'fb.pg.exports.schedule',
  Component: ScheduleDialog,
};
