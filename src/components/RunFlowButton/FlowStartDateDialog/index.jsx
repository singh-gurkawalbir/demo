import React, { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Button from '@material-ui/core/Button';
import { selectors } from '../../../reducers';
import actions from '../../../actions';
import ModalDialog from '../../ModalDialog';
import DynaForm from '../../DynaForm';
import DynaSubmit from '../../DynaForm/DynaSubmit';
import flowStartDateMetadata from './metadata';
import Spinner from '../../Spinner';
import useFormInitWithPermissions from '../../../hooks/useFormInitWithPermissions';
import ButtonGroup from '../../ButtonGroup';
import adjustTimezone from '../../../utils/adjustTimezone';
import convertToTimezone from '../../../utils/convertToTimezone';

export default function FlowStartDateDialog(props) {
  const { flowId, onClose, disabled, onRun } = props;
  const dispatch = useDispatch();
  const preferences = useSelector(state => selectors.userOwnPreferences(state));
  const profilePreferences = useSelector(state =>
    selectors.userProfilePreferencesProps(state)
  );
  const timeZone = profilePreferences?.timezone;

  let lastExportDateTime = useSelector(state =>
    selectors.getLastExportDateTime(state, flowId)
  ).data;

  if (timeZone) {
    lastExportDateTime = convertToTimezone(lastExportDateTime, timeZone);
  }
  const selectorStatus = useSelector(state =>
    selectors.getLastExportDateTime(state, flowId)
  ).status;

  if (!lastExportDateTime) {
    lastExportDateTime = new Date();
    if (timeZone) {
      lastExportDateTime = convertToTimezone(new Date(), timeZone);
    }
  }

  const fetchLastExportDateTime = useCallback(() => {
    dispatch(actions.flow.requestLastExportDateTime({ flowId }));
  }, [dispatch, flowId]);
  const cancelDialog = useCallback(() => {
    onClose();
  }, [onClose]);

  useEffect(() => {
    fetchLastExportDateTime();
  }, [fetchLastExportDateTime]);

  const handleSubmit = formVal => {
    let customStartDate;

    if (formVal.deltaType === 'custom') {
      customStartDate = adjustTimezone(formVal.startDateCustom, formVal.timeZone);
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
    remount: lastExportDateTime,
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
        <ButtonGroup>
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
        </ButtonGroup>
      </div>
    </ModalDialog>
  );
}
