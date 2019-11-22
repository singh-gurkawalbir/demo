import { useSelector, useDispatch } from 'react-redux';
import { makeStyles, IconButton, Button } from '@material-ui/core';
import clsx from 'clsx';
import { Fragment } from 'react';
import Close from '../icons/CloseIcon';
import actions from '../../actions';
import * as selectors from '../../reducers';
import DynaForm from '../DynaForm';
import DynaSubmit from '../DynaForm/DynaSubmit';
import {
  getMetadata,
  setValues,
  getScheduleStartMinute,
  getScheduleVal,
} from './util';

const useStyles = makeStyles(theme => ({
  modalContent: {
    width: '60vw',
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: 2,
  },
}));

export default function FlowSchedule(props) {
  const dispatch = useDispatch();
  const { onClose, className, disabled, pg, index } = props;
  const { flow } = props;
  const preferences = useSelector(state =>
    selectors.userProfilePreferencesProps(state)
  );
  const integration = useSelector(state =>
    selectors.resource(state, 'integrations', flow._integrationId)
  );
  let resource = pg || flow;
  const schedule = (pg && pg.schedule) || flow.schedule;
  const scheduleStartMinute = getScheduleStartMinute(resource, preferences);
  const handleSubmit = formVal => {
    const scheduleVal = getScheduleVal(formVal, scheduleStartMinute);
    let patchSet;

    if (pg && pg._exportId) {
      const patchSet = [
        {
          op: 'replace',
          path: `/pageGenerators/${index}/schedule`,
          value: scheduleVal,
        },
      ];

      dispatch(actions.resource.patchStaged(flow._id, patchSet, 'value'));
      dispatch(actions.resource.commitStaged('flows', flow._id, 'value'));
    } else {
      patchSet = [
        {
          op: 'replace',
          path: '/schedule',
          value: scheduleVal,
        },
      ];

      dispatch(actions.resource.patchStaged(flow._id, patchSet, 'value'));
      dispatch(actions.resource.commitStaged('flows', flow._id, 'value'));
    }

    onClose();
  };

  const classes = useStyles();

  resource = setValues(resource, schedule);

  if (resource && !resource.frequency) {
    resource.frequency = '';
  }

  return (
    <Fragment>
      <IconButton
        data-test="closeFlowSchedule"
        aria-label="Close"
        className={classes.closeButton}
        onClick={onClose}>
        <Close />
      </IconButton>
      <div className={clsx(classes.modalContent, className)}>
        <DynaForm
          disabled={disabled}
          fieldMeta={getMetadata({
            resource,
            integration,
            preferences,
            flow,
            schedule,
          })}>
          <DynaSubmit onClick={handleSubmit} color="primary">
            Save
          </DynaSubmit>
          <Button onClick={onClose} variant="text" color="primary">
            Cancel
          </Button>
        </DynaForm>
      </div>
    </Fragment>
  );
}
