import React, { useEffect, useCallback, useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Spinner, TextButton } from '@celigo/fuse-ui';
import { selectors } from '../../../reducers';
import actions from '../../../actions';
import ModalDialog from '../../ModalDialog';
import DynaForm from '../../DynaForm';
import DynaSubmit from '../../DynaForm/DynaSubmit';
import flowStartDateMetadata from './metadata';
import useFormInitWithPermissions from '../../../hooks/useFormInitWithPermissions';
import adjustTimezone from '../../../utils/adjustTimezone';
import { convertUtcToTimezone } from '../../../utils/date';
import ActionGroup from '../../ActionGroup';

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

  const lastExportDateTime = useMemo(() =>
    convertUtcToTimezone(origLastExportDateTime || defaultDate, preferences.dateFormat, preferences.timeFormat, timeZone, {skipFormatting: true}),
  [defaultDate, origLastExportDateTime, preferences.dateFormat, preferences.timeFormat, timeZone]
  );

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
    return <Spinner />;
  }

  if (selectorStatus === 'error') {
    onClose();
  }

  return (
    <ModalDialog show onClose={onClose}>
      <div>Delta flow</div>
      <div>
        <DynaForm formKey={formKey} />
        <ActionGroup>
          <DynaSubmit
            ignoreFormTouchedCheck
            formKey={formKey}
            data-test="submit"
            onClick={handleSubmit}>
            Run
          </DynaSubmit>
          <TextButton data-test="close" onClick={cancelDialog}>
            Cancel
          </TextButton>
        </ActionGroup>
      </div>
    </ModalDialog>
  );
}
