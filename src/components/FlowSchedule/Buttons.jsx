import moment from 'moment';
import React, { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import actions from '../../actions';
import { sanitizePatchSet } from '../../forms/formFactory/utils';
import useEnqueueSnackbar from '../../hooks/enqueueSnackbar';
import { selectors } from '../../reducers';
import {
  getScheduleStartMinute,
  getScheduleVal,
  setValues,
} from './util';
import SaveAndCloseButtonGroupForm from '../SaveAndCloseButtonGroup/SaveAndCloseButtonGroupForm';

export default function FlowScheduleButtons({
  formKey,
  flow,
  onClose,
  pg,
  index,
  testFlag = false,
}) {
  const dispatch = useDispatch();
  const [enqueueSnackbar] = useEnqueueSnackbar();
  const exp = useSelector(state =>
    selectors.resource(state, 'exports', pg && pg._exportId)
  );
  let resource = pg || flow;
  const schedule = pg?.schedule || flow?.schedule;
  const scheduleStartMinute = testFlag ? 0 : getScheduleStartMinute(exp || flow);

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

    dispatch(actions.resource.patchAndCommitStaged('flows', flow?._id, sanitized, { asyncKey: formKey }));
  }, [dispatch, flow, pg, index, scheduleStartMinute, formKey]);

  const formValues = useSelector(state => selectors.formValueTrimmed(state, formKey), shallowEqual);
  const handleValidateAndSubmit = useCallback(closeAfterSave => {
    if (
      formValues?.startTime &&
      formValues?.endTime &&
        !moment(formValues?.startTime, 'LT').isBefore(moment(formValues?.endTime, 'LT'))
    ) {
      return enqueueSnackbar({
        message: 'End Time is invalid.',
        variant: 'error',
      });
    }
    // If valid form values
    onSave(formValues);
    if (closeAfterSave) {
      onClose();
    }
  }, [enqueueSnackbar, formValues, onClose, onSave]
  );

  const resourceIdentifier = pg?._exportId ? 'pagegenerator' : 'flow';

  resource = setValues(resource, schedule, scheduleStartMinute, flow, index, resourceIdentifier);

  if (resource && !resource.frequency) {
    resource.frequency = '';
  }

  return (
    <SaveAndCloseButtonGroupForm
      formKey={formKey}
      onSave={handleValidateAndSubmit}
      onClose={onClose}
     />
  );
}
