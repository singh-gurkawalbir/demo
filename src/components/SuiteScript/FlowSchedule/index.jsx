import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Button from '@material-ui/core/Button';
import moment from 'moment';
import actions from '../../../actions';
import DynaForm from '../../DynaForm';
import DynaSubmit from '../../DynaForm/DynaSubmit';
import useEnqueueSnackbar from '../../../hooks/enqueueSnackbar';
import {
  FREQUENCY,
  WEEK_DAYS,
  getMetadata,
  getScheduleDetails,
  getCronExpression,
} from './util';
import * as selectors from '../../../reducers';


export default function FlowSchedule({ flow, onClose, className }) {
  const dispatch = useDispatch();
  const [enqueueSnackbar] = useEnqueueSnackbar();
  const isManageLevelUser = useSelector(state => selectors.userHasManageAccessOnSuiteScriptAccount(state, flow.ssLinkedConnectionId));
  const scheduleStartMinute = 0;
  const handleSubmit = useCallback(
    (formValues) => {
      if (
        formValues.startTime &&
        formValues.endTime &&
        !moment(formValues.startTime, 'LT').isBefore(
          moment(formValues.endTime, 'LT')
        )
      ) {
        return enqueueSnackbar({
          message: 'End Time is invalid.',
          variant: 'error',
        });
      }

      const { frequency, dayToRunOn } = formValues;
      let { startTime, endTime, daysToRunOn } = formValues;
      if (frequency === FREQUENCY.ONCE_WEEKLY.value) {
        daysToRunOn = [dayToRunOn];
      }
      if (['', FREQUENCY.MANUAL.value].includes(frequency)) {
        startTime = '';
        endTime = '';
        daysToRunOn = [];
      }
      if (
        [
          FREQUENCY.ONCE_WEEKLY.value,
          FREQUENCY.ONCE_DAILY.value,
          FREQUENCY.TWICE_DAILY.value,
        ].includes(frequency)
      ) {
        endTime = '';
      }
      const scheduleDetails = { frequency, startTime, endTime };
      Object.keys(WEEK_DAYS).forEach((d) => {
        if (daysToRunOn.includes(d)) {
          scheduleDetails[d.toLowerCase()] = d;
        }
      });
      const schedule = getCronExpression(scheduleDetails);

      const patchSet = [
        {
          op: 'replace',
          path: '/schedule',
          value: schedule,
        },
        {
          op: 'replace',
          path: '/scheduleDetails',
          value: scheduleDetails,
        },
      ];

      dispatch(
        actions.suiteScript.resource.patchStaged(
          flow._id,
          patchSet,
          'value',
          flow.ssLinkedConnectionId,
          flow._integrationId,
          'flows'
        )
      );
      dispatch(
        actions.suiteScript.resource.commitStaged(
          flow._id,
          'value',
          flow.ssLinkedConnectionId,
          flow._integrationId,
          'flows'
        )
      );
      onClose();
    },
    [dispatch, enqueueSnackbar, flow, onClose]
  );

  const scheduleDetails = getScheduleDetails(flow, scheduleStartMinute);

  const fieldMeta = getMetadata({
    scheduleDetails,
    scheduleStartMinute,
  });

  return (
    <div className={className}>
      <DynaForm
        integrationId={flow._integrationId}
        resourceType="flows"
        resourceId={flow._id}
        disabled={!isManageLevelUser}
        fieldMeta={fieldMeta}
        optionsHandler={fieldMeta.optionsHandler}
      >
        <DynaSubmit disabled={!isManageLevelUser} onClick={handleSubmit} >
          Save
        </DynaSubmit>
        <Button onClick={onClose} variant="text" >
          Cancel
        </Button>
      </DynaForm>
    </div>
  );
}
