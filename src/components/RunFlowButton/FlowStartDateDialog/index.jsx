import React, { useEffect, useCallback, useMemo, useState } from 'react';
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
import { convertUtcToTimezone } from '../../../utils/date';

export default function FlowStartDateDialog(props) {
  const [defaultDate] = useState(new Date());
  const { flowId, onClose, disabled, onRun } = props;
  const dispatch = useDispatch();
  const preferences = useSelector(state => selectors.userOwnPreferences(state));
  const timeZone = useSelector(state => selectors.userTimezone(state));
  const selectorStatus = useSelector(state =>
    selectors.getLastExportDateTime(state, flowId)
  ).status;

  const origLastExportDateTime = useSelector(state =>
    selectors.getLastExportDateTime(state, flowId)
  ).data;

  const lastExportDateTime = useMemo(() => {
    if (!origLastExportDateTime) {
      if (!timeZone) {
        return defaultDate;
      }

      return convertUtcToTimezone(defaultDate, preferences.dateFormat, preferences.timeFormat, timeZone, {skipFormatting: true});
    }

    if (!timeZone) {
      return origLastExportDateTime;
    }

    return convertUtcToTimezone(origLastExportDateTime, preferences.dateFormat, preferences.timeFormat, timeZone, {skipFormatting: true});
  }, [defaultDate, origLastExportDateTime, preferences.dateFormat, preferences.timeFormat, timeZone]);
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

  const metaValue = useMemo(() => ({startDateAutomatic: lastExportDateTime}), [lastExportDateTime]);
  const formKey = useFormInitWithPermissions({
    disabled,
    fieldMeta,
    metaValue,
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
