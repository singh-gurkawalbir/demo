import { makeStyles } from '@material-ui/core/styles';
import { useSelector, useDispatch } from 'react-redux';
import {
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from '@material-ui/core';
import RightDrawerRouter from '../RightDrawer';
import {
  getMetadata,
  setValues,
  getScheduleStartMinute,
  getPatchSet,
} from '../../../../components/FlowSchedule/util';
import * as selectors from '../../../../reducers';
import actions from '../../../../actions';
import Close from '../../../../components/icons/CloseIcon';
import DynaForm from '../../../../components/DynaForm';
import DynaSubmit from '../../../../components/DynaForm/DynaSubmit';

const useStyle = makeStyles(theme => ({
  fbContentDrawer: {
    width: '80vw',
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: 2,
  },
}));

export default function ScheduleDrawer({ flow, history, ...props }) {
  const dispatch = useDispatch();
  const classes = useStyle();
  const preferences = useSelector(state =>
    selectors.userProfilePreferencesProps(state)
  );
  const integration = useSelector(state =>
    selectors.resource(state, 'integrations', flow._integrationId)
  );
  let localFlow = flow;
  const scheduleStartMinute = getScheduleStartMinute(flow, preferences);
  const onClose = () => history.goBack();
  const handleSubmit = formVal => {
    const patchSet = getPatchSet(formVal, scheduleStartMinute);

    dispatch(actions.resource.patchStaged(flow._id, patchSet, 'value'));
    dispatch(actions.resource.commitStaged('flows', flow._id, 'value'));

    onClose();
  };

  localFlow = setValues(flow);

  if (localFlow && !localFlow.frequency) {
    localFlow.frequency = '';
  }

  return (
    <RightDrawerRouter
      {...props}
      path="schedule"
      width="80vw"
      className={classes.fbContentDrawer}>
      <IconButton
        data-test="closeFlowSchedule"
        aria-label="Close"
        className={classes.closeButton}
        onClick={onClose}>
        <Close />
      </IconButton>
      <DialogTitle disableTypography>
        <Typography variant="h6">Schedule</Typography>
      </DialogTitle>
      <DialogContent className={classes.modalContent}>
        <DynaForm
          fieldMeta={getMetadata({
            flow: localFlow,
            integration,
            preferences,
          })}>
          <DynaSubmit onClick={handleSubmit} color="primary">
            Save
          </DynaSubmit>
        </DynaForm>
      </DialogContent>
    </RightDrawerRouter>
  );
}
