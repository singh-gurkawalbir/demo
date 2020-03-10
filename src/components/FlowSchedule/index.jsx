import { Fragment, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Button from '@material-ui/core/Button';
import actions from '../../actions';
import * as selectors from '../../reducers';
import DynaForm from '../DynaForm';
import DynaSubmit from '../DynaForm/DynaSubmit';
import { sanitizePatchSet } from '../../forms/utils';
import {
  getMetadata,
  setValues,
  getScheduleStartMinute,
  getScheduleVal,
} from './util';

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
  const integration = useSelector(state =>
    selectors.resource(state, 'integrations', flow._integrationId)
  );
  const exp = useSelector(state =>
    selectors.resource(state, 'exports', pg && pg._exportId)
  );
  const exports = useSelector(
    state => selectors.resourceList(state, { type: 'exports' }).resources
  );
  const flows = useSelector(
    state => selectors.resourceList(state, { type: 'flows' }).resources
  );
  let resource = pg || flow;
  const schedule = (pg && pg.schedule) || flow.schedule;
  const scheduleStartMinute = getScheduleStartMinute(exp || flow, preferences);
  const handleSubmit = useCallback(
    formVal => {
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
      onClose();
    },
    [dispatch, flow, index, onClose, pg, scheduleStartMinute]
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
    <Fragment>
      <div className={className}>
        <DynaForm
          disabled={disabled}
          fieldMeta={fieldMeta}
          optionsHandler={fieldMeta.optionsHandler}>
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
