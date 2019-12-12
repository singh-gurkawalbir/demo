import React, { Fragment, useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment-timezone';
import { useHistory } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import * as selectors from '../../reducers';
import actions from '../../actions';
import DynaForm from '../DynaForm';
import DynaSubmit from '../DynaForm/DynaSubmit';
import flowStartDateMetadata from './metadata';
import Spinner from '../Spinner';

export default function FlowStartDate(props) {
  const { flowId, onClose, disabled, isJobDashBoard } = props;
  const dispatch = useDispatch();
  const history = useHistory();
  const [state, setState] = useState({
    changeIdentifier: 0,
    lastExportDateTimeLoaded: false,
  });
  const { changeIdentifier, lastExportDateTimeLoaded } = state;
  const flow = useSelector(state => selectors.resource(state, 'flows', flowId));
  const preferences = useSelector(state =>
    selectors.userProfilePreferencesProps(state)
  );
  const lastExportDateTime = useSelector(state =>
    selectors.getLastExportDateTime(state, flow._id)
  );
  let startDate;
  const timeZone = preferences && preferences.timezone;

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

  useEffect(() => {
    fetchLastExportDateTime();
  }, [fetchLastExportDateTime]);
  useEffect(() => {
    if (!lastExportDateTimeLoaded && lastExportDateTime) {
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

    if (isJobDashBoard) {
      dispatch(actions.flow.run({ flowId: flow._id, customStartDate }));
    } else {
      dispatch(actions.flow.run({ flowId: flow._id, customStartDate }));

      if (flow._connectorId) {
        history.push(`/pg/integrationApp/${flow._integrationId}/dashboard`);
      } else {
        history.push(
          `/pg/integrations/${flow._integrationId || 'none'}/dashboard`
        );
      }
    }

    onClose();
  };

  if (!timeZone || !startDate) {
    return <Spinner />;
  }

  const fieldMeta = flowStartDateMetadata.getMetadata({
    timeZone,
    startDate,
    preferences,
  });

  return (
    <Fragment>
      <DynaForm disabled={disabled} fieldMeta={fieldMeta}>
        <Button
          data-test="cancelOperandSettings"
          onClick={() => {
            onClose();
          }}>
          Cancel
        </Button>
        <DynaSubmit data-test="saveOperandSettings" onClick={handleSubmit}>
          Run
        </DynaSubmit>
      </DynaForm>
    </Fragment>
  );
}
