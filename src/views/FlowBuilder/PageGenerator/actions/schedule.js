import React from 'react';
import { useSelector } from 'react-redux';
import Icon from '../../../../components/icons/CalendarIcon';
import ModalDialog from '../../../../components/ModalDialog';
import { selectors } from '../../../../reducers';
import FlowSchedule from '../../../../components/FlowSchedule';
import useFormOnCancelContext from '../../../../components/FormOnCancelContext';

const formKey = 'flow-schedule';

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

  const {setCancelTriggered, disabled} = useFormOnCancelContext(formKey);

  return (
    <ModalDialog
      show={open}
      onClose={setCancelTriggered}
      minWidth="md"
      maxWidth="md"
      disableClose={disabled}>
      <div>Flow schedule override</div>
      <div>
        <FlowSchedule
          formKey={formKey} flow={flow} onClose={onClose} pg={pg}
          disabled={isViewMode}
          index={index} />
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
