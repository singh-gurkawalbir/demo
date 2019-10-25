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
  getPatchSet,
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
  const { onClose, className } = props;
  let { flow } = props;
  const preferences = useSelector(state =>
    selectors.userProfilePreferencesProps(state)
  );
  const integration = useSelector(state =>
    selectors.resource(state, 'integrations', flow._integrationId)
  );
  const scheduleStartMinute = getScheduleStartMinute(flow, preferences);
  const handleSubmit = formVal => {
    const patchSet = getPatchSet(formVal, scheduleStartMinute);

    dispatch(actions.resource.patchStaged(flow._id, patchSet, 'value'));
    dispatch(actions.resource.commitStaged('flows', flow._id, 'value'));

    onClose();
  };

  const classes = useStyles();

  flow = setValues(flow);

  if (flow && !flow.frequency) {
    flow.frequency = '';
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
          fieldMeta={getMetadata({
            flow,
            integration,
            preferences,
          })}>
          <DynaSubmit onClick={handleSubmit} color="primary">
            Save
          </DynaSubmit>
          <Button onClick={onClose} variant="contained" color="secondary">
            Cancel
          </Button>
        </DynaForm>
      </div>
    </Fragment>
  );
}
