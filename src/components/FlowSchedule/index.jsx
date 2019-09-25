import { useSelector, useDispatch } from 'react-redux';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  makeStyles,
  IconButton,
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
  const { title, onClose, flow: resource } = props;
  const preferences = useSelector(state =>
    selectors.userProfilePreferencesProps(state)
  );
  const integration = useSelector(state =>
    selectors.userProfilePreferencesProps(
      state,
      'integration',
      resource._integrationId
    )
  );
  let scheduleStartMinute = 0;

  if (preferences && preferences.scheduleShiftForFlowsCreatedAfter) {
    const changeStartMinuteForFlowsCreatedAfter = moment(
      preferences.scheduleShiftForFlowsCreatedAfter
    );

    if (
      !resource.createdAt ||
      changeStartMinuteForFlowsCreatedAfter.diff(moment(resource.createdAt)) < 0
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

    dispatch(actions.resource.patchStaged(resource._id, patchSet, 'value'));
    dispatch(actions.resource.commitStaged('flows', resource._id, 'value'));

    onClose();
  };

  const classes = useStyles();
  const initialisedResource = setValues(resource);

  if (initialisedResource && !initialisedResource.frequency) {
    initialisedResource.initialisedResource = '';
  }

  return (
    <Dialog open maxWidth={false}>
      <IconButton
        aria-label="Close"
        className={classes.closeButton}
        onClick={onClose}>
        <Close />
      </IconButton>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent className={classes.modalContent}>
        <DynaForm
          fieldMeta={getMetadata({
            initialisedResource,
            integration,
            preferences,
          })}>
          <DynaSubmit onClick={handleSubmit}>Save</DynaSubmit>
        </DynaForm>
      </DialogContent>
    </Dialog>
  );
}
