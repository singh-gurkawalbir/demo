import React, { Fragment, useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment-timezone';
import Button from '@material-ui/core/Button';
import * as selectors from '../../reducers';
import actions from '../../actions';
import DynaForm from '../DynaForm';
import DynaSubmit from '../DynaForm/DynaSubmit';
import flowStartDateMetadata from './metadata';
import Spinner from '../Spinner';

export default function DeltaFlowStartDate(props) {
  const { flowId, onClose, disabled, runDeltaFlow } = props;
  const dispatch = useDispatch();
  const [state, setState] = useState({
    changeIdentifier: 0,
    lastExportDateTimeLoaded: false,
  });
  const { changeIdentifier, lastExportDateTimeLoaded } = state;
  const flow = useSelector(state => selectors.resource(state, 'flows', flowId));
  const preferences = useSelector(state =>
    selectors.userProfilePreferencesProps(state)
  );
  let lastExportDateTime = useSelector(state =>
    selectors.getLastExportDateTime(state, flow._id)
  ).data;
  const selectorStatus = useSelector(state =>
    selectors.getLastExportDateTime(state, flow._id)
  ).status;
  let startDate;
  const timeZone = preferences && preferences.timezone;

  if (!lastExportDateTime) {
    lastExportDateTime = new Date();
  }

  if (lastExportDateTime) {
    if (
      moment(lastExportDateTime)
        .tz(timeZone)
        .format(`${preferences.dateFormat} ${preferences.timeFormat}`) ===
      'Invalid date'
    ) {
      startDate = '';
    } else {
      startDate = moment(lastExportDateTime)
        .tz(timeZone)
        .format(`${preferences.dateFormat} ${preferences.timeFormat}`);
    }
  } else {
    startDate = '';
  }

  const fetchLastExportDateTime = useCallback(() => {
    dispatch(actions.flow.requestLastExportDateTime({ flowId: flow._id }));
  }, [dispatch, flow._id]);
  const cancelDialog = useCallback(() => {
    onClose();
  }, [onClose]);

  useEffect(() => {
    fetchLastExportDateTime();
  }, [fetchLastExportDateTime]);
  useEffect(() => {
    if (!lastExportDateTimeLoaded && selectorStatus) {
      setState({
        changeIdentifier: changeIdentifier + 1,
        lastExportDateTimeLoaded: true,
      });
    }
  }, [
    changeIdentifier,
    fetchLastExportDateTime,
    lastExportDateTime,
    lastExportDateTimeLoaded,
    selectorStatus,
  ]);

  const handleSubmit = formVal => {
    let customStartDate;

    if (formVal.deltaType === 'custom') {
      customStartDate = moment.tz(
        formVal.startDateCustom,
        `${preferences.dateFormat} ${preferences.timeFormat}`,
        formVal.timezone
      );

      customStartDate = customStartDate ? customStartDate.toISOString() : null;
    }

    runDeltaFlow(customStartDate);

    onClose();
  };

  if (!timeZone || !selectorStatus) {
    return <Spinner />;
  }

  if (selectorStatus === 'error') {
    onClose();
  }

  const fieldMeta = flowStartDateMetadata.getMetadata({
    timeZone,
    startDate,
    preferences,
  });

  return (
    <Fragment>
      <DynaForm disabled={disabled} fieldMeta={fieldMeta}>
        <Button data-test="close" onClick={cancelDialog}>
          Cancel
        </Button>
        <DynaSubmit data-test="submit" onClick={handleSubmit}>
          Run
        </DynaSubmit>
      </DynaForm>
    </Fragment>
  );
}
