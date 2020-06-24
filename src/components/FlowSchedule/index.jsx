import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Button from '@material-ui/core/Button';
import moment from 'moment';
import actions from '../../actions';
import * as selectors from '../../reducers';
import DynaForm from '../DynaForm';
import DynaSubmit from '../DynaForm/DynaSubmit';
import { sanitizePatchSet } from '../../forms/utils';
import useEnqueueSnackbar from '../../hooks/enqueueSnackbar';
import {
  getMetadata,
  setValues,
  getScheduleStartMinute,
  getScheduleVal,
} from './util';
import useSelectorMemo from '../../hooks/selectors/useSelectorMemo';
import useSaveStatusIndicator from '../../hooks/useSaveStatusIndicator';

const exportFilterConfig = { type: 'exports' };
const flowsFilterConfig = { type: 'flows' };

export default function FlowSchedule({
  flow,
  onClose,
  className,
  disabled,
  pg,
  index,
}) {
  const dispatch = useDispatch();
  const preferences = useSelector(state =>
    selectors.userProfilePreferencesProps(state)
  );
  const [enqueueSnackbar] = useEnqueueSnackbar();
  const integration = useSelector(state =>
    selectors.resource(state, 'integrations', flow._integrationId)
  );
  const exp = useSelector(state =>
    selectors.resource(state, 'exports', pg && pg._exportId)
  );
  const exports = useSelectorMemo(
    selectors.makeResourceListSelector,
    exportFilterConfig
  ).resources;
  const flows = useSelectorMemo(
    selectors.makeResourceListSelector,
    flowsFilterConfig
  ).resources;
  let resource = pg || flow;
  const schedule = (pg && pg.schedule) || flow.schedule;
  const scheduleStartMinute = getScheduleStartMinute(exp || flow, preferences);

  const onSave = useCallback((formVal) => {
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

  resource = setValues(resource, schedule, scheduleStartMinute);

  if (resource && !resource.frequency) {
    resource.frequency = '';
  }

  const fieldMeta = getMetadata({
    resource,
    integration,
    preferences,
    flow,
    schedule,
    exp,
    exports,
    pg,
    flows,
    scheduleStartMinute,
  });

  return (
    <div className={className}>
      <DynaForm
        integrationId={flow._integrationId}
        resourceType="flows"
        resourceId={flow._id}
        disabled={disabled}
        fieldMeta={fieldMeta}
        optionsHandler={fieldMeta.optionsHandler}>
        <DynaSubmit onClick={handleValidateAndSubmit()} color="primary" disabled={disableSave}>
          {defaultLabels.saveLabel}
        </DynaSubmit>
        <DynaSubmit onClick={handleValidateAndSubmit(true)} color="primary" disabled={disableSave}>
          {defaultLabels.saveAndCloseLabel}
        </DynaSubmit>
        <Button onClick={onClose} variant="text" color="primary">
          Cancel
        </Button>
      </DynaForm>
    </div>
  );
}
