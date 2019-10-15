import { useSelector, useDispatch } from 'react-redux';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  makeStyles,
  IconButton,
  Typography,
} from '@material-ui/core';
import moment from 'moment';
import Close from '../icons/CloseIcon';
import actions from '../../actions';
import * as selectors from '../../reducers';
import DynaForm from '../DynaForm';
import DynaSubmit from '../DynaForm/DynaSubmit';
import { getCronExpression, getMetadata, setValues } from './util';

const useStyles = makeStyles(theme => ({
  modalContent: {
    width: '60vw',
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
  },
}));

export default function FlowSchedule(props) {
  const dispatch = useDispatch();
  const { title, onClose } = props;
  let { flow } = props;
  const preferences = useSelector(state =>
    selectors.userProfilePreferencesProps(state)
  );
  const integration = useSelector(state =>
    selectors.resource(state, 'integrations', flow._integrationId)
  );
  let scheduleStartMinute = 0;

  if (preferences && preferences.scheduleShiftForFlowsCreatedAfter) {
    const changeStartMinuteForFlowsCreatedAfter = moment(
      preferences.scheduleShiftForFlowsCreatedAfter
    );

    if (
      !flow.createdAt ||
      changeStartMinuteForFlowsCreatedAfter.diff(moment(flow.createdAt)) < 0
    ) {
      scheduleStartMinute = 10;
    }
  }

  const ADVANCED_TAB = '1';
  const handleSubmit = formVal => {
    let scheduleValue;

    if (formVal.activeTab === ADVANCED_TAB) {
      // Need to handle Cron Editor Changes
      scheduleValue = formVal.schedule;
    } else {
      if (
        formVal.startTime &&
        formVal.endTime &&
        !moment(formVal.startTime, 'LT').isBefore(moment(formVal.endTime, 'LT'))
      ) {
        // alert('End Time is invalid');
        return false;
      }

      scheduleValue =
        getCronExpression(formVal, scheduleStartMinute) === '? * * * * *'
          ? ''
          : getCronExpression(formVal, scheduleStartMinute);
    }

    const patchSet = [
      {
        op: 'replace',
        path: '/schedule',
        value: scheduleValue,
      },
    ];

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
    <Dialog open maxWidth={false}>
      <IconButton
        data-test="closeFlowSchedule"
        aria-label="Close"
        className={classes.closeButton}
        onClick={onClose}>
        <Close />
      </IconButton>
      <DialogTitle disableTypography>
        <Typography variant="h6">{title}</Typography>
      </DialogTitle>
      <DialogContent className={classes.modalContent}>
        <DynaForm
          fieldMeta={getMetadata({
            flow,
            integration,
            preferences,
          })}>
          <DynaSubmit onClick={handleSubmit}>Save</DynaSubmit>
        </DynaForm>
      </DialogContent>
    </Dialog>
  );
}
