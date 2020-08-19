import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment-timezone';
import Button from '@material-ui/core/Button';
import { selectors } from '../../../reducers';
import actions from '../../../actions';
import ModalDialog from '../../ModalDialog';
import DynaForm from '../../DynaForm';
import DynaSubmit from '../../DynaForm/DynaSubmit';
import flowStartDateMetadata from './metadata';
import Spinner from '../../Spinner';
import useFormInitWithPermissions from '../../../hooks/useFormInitWithPermissions';

export default function FlowStartDateDialog(props) {
  const { flowId, onClose, disabled, onRun } = props;
  const dispatch = useDispatch();
  const [state, setState] = useState({
    changeIdentifier: 0,
    lastExportDateTimeLoaded: false,
  });
  const { changeIdentifier, lastExportDateTimeLoaded } = state;
  const flow = useSelector(state => selectors.resource(state, 'flows', flowId));
  const preferences = useSelector(state => selectors.userOwnPreferences(state));
  const profilePreferences = useSelector(state =>
    selectors.userProfilePreferencesProps(state)
  );
  let lastExportDateTime = useSelector(state =>
    selectors.getLastExportDateTime(state, flow._id)
  ).data;
  const selectorStatus = useSelector(state =>
    selectors.getLastExportDateTime(state, flow._id)
  ).status;
  const timeZone = profilePreferences && profilePreferences.timezone;

  if (!lastExportDateTime) {
    lastExportDateTime = new Date();
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
        formVal.timeZone
      );

      customStartDate = customStartDate ? customStartDate.toISOString() : null;
    }

    onRun(customStartDate);

    onClose();
  };

  const fieldMeta = flowStartDateMetadata.getMetadata({
    timeZone,
    startDate: lastExportDateTime,
    format: `${preferences.dateFormat} ${preferences.timeFormat}`,
  });
  const formKey = useFormInitWithPermissions({
    disabled,
    fieldMeta,
  });

  if (!selectorStatus) {
    return <Spinner size={24} color="primary" />;
  }

  if (selectorStatus === 'error') {
    onClose();
  }

  return (
    <ModalDialog show onClose={onClose}>
      <div>Delta flow</div>
      <div>
        <DynaForm formKey={formKey} fieldMeta={fieldMeta} />
        <DynaSubmit
          formKey={formKey}
          skipDisableButtonForFormTouched
          data-test="submit"
          onClick={handleSubmit}>
          Run
        </DynaSubmit>
        <Button data-test="close" onClick={cancelDialog}>
          Cancel
        </Button>
      </div>
    </ModalDialog>
  );
}
