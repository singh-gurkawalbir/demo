import Button from '@material-ui/core/Button';
import moment from 'moment';
import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import actions from '../../actions';
import { sanitizePatchSet } from '../../forms/utils';
import useEnqueueSnackbar from '../../hooks/enqueueSnackbar';
import useSaveStatusIndicator from '../../hooks/useSaveStatusIndicator';
import { selectors } from '../../reducers';
import DynaSubmit from '../DynaForm/DynaSubmit';
import {
  getScheduleStartMinute,
  getScheduleVal,
  setValues,
} from './util';
import ButtonGroup from '../ButtonGroup';

export default function FlowScheduleButtons({
  formKey,
  flow,
  onClose,
  pg,
  index,
}) {
  const dispatch = useDispatch();
  const preferences = useSelector(state =>
    selectors.userProfilePreferencesProps(state)
  );
  const [enqueueSnackbar] = useEnqueueSnackbar();
  const exp = useSelector(state =>
    selectors.resource(state, 'exports', pg && pg._exportId)
  );
  let resource = pg || flow;
  const schedule = pg?.schedule || flow?.schedule;
  const scheduleStartMinute = getScheduleStartMinute(exp || flow, preferences);

  const onSave = useCallback(formVal => {
    const scheduleVal = getScheduleVal(formVal, scheduleStartMinute);
    const patchSet = [
      {
        op: 'replace',
        path:
          pg && pg._exportId
            ? `/pageGenerators/${index}/schedule`
            : '/schedule',
        value: scheduleVal,
      },
      {
        op: 'replace',
        path:
          pg && pg._exportId
            ? `/pageGenerators/${index}/_keepDeltaBehindFlowId`
            : '/_keepDeltaBehindFlowId',
        value:
          formVal && formVal._keepDeltaBehindFlowId
            ? formVal._keepDeltaBehindFlowId
            : undefined,
      },
      {
        op: 'replace',
        path:
          pg && pg._exportId
            ? `/pageGenerators/${index}/_keepDeltaBehindExportId`
            : '/_keepDeltaBehindExportId',
        value:
          pg && pg._exportId && formVal && formVal._keepDeltaBehindFlowId
            ? formVal._keepDeltaBehindExportId
            : undefined,
      },
    ];

    if (formVal.timeZone) {
      patchSet.push({
        op: 'replace',
        path: '/timezone',
        value: formVal.timeZone,
      });
    }
    const sanitized = sanitizePatchSet({
      patchSet,
      flow,
      skipRemovePatches: true,
    });

    dispatch(actions.resource.patchStaged(flow._id, sanitized, 'value'));
    dispatch(actions.resource.commitStaged('flows', flow._id, 'value'));
  }, [dispatch, flow, pg, index, scheduleStartMinute]);

  const { submitHandler, disableSave, defaultLabels} = useSaveStatusIndicator(
    {
      path: `/flows/${flow._id}`,
      onSave,
      onClose,
    }
  );

  const handleValidateAndSubmit = useCallback(
    closeOnSave => formVal => {
      if (
        formVal.startTime &&
        formVal.endTime &&
        !moment(formVal.startTime, 'LT').isBefore(moment(formVal.endTime, 'LT'))
      ) {
        return enqueueSnackbar({
          message: 'End Time is invalid.',
          variant: 'error',
        });
      }
      // If valid form values
      submitHandler(closeOnSave)(formVal);
    },
    [enqueueSnackbar, submitHandler]
  );

  const resourceIdentifier = pg?._exportId ? 'pagegenerator' : 'flow';

  resource = setValues(resource, schedule, scheduleStartMinute, flow, index, resourceIdentifier);

  if (resource && !resource.frequency) {
    resource.frequency = '';
  }

  return (
    <ButtonGroup>
      <DynaSubmit
        formKey={formKey}
        onClick={handleValidateAndSubmit()}
        color="primary"
        data-test="saveFlowSchedule"
        disabled={disableSave}>
        {defaultLabels.saveLabel}
      </DynaSubmit>
      <DynaSubmit
        formKey={formKey}
        onClick={handleValidateAndSubmit(true)}
        color="secondary"
        data-test="saveAndCloseFlowSchedule"
        disabled={disableSave}>
        {defaultLabels.saveAndCloseLabel}
      </DynaSubmit>
      <Button onClick={onClose} variant="text" color="primary">
        Cancel
      </Button>
    </ButtonGroup>
  );
}
