import React, { useEffect, useCallback, useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { selectors } from '../../../reducers';
import actions from '../../../actions';
import ModalDialog from '../../ModalDialog';
import DynaForm from '../../DynaForm';
import DynaSubmit from '../../DynaForm/DynaSubmit';
import flowStartDateMetadata from './metadata';
import Spinner from '../../Spinner';
import useFormInitWithPermissions from '../../../hooks/useFormInitWithPermissions';
import adjustTimezone from '../../../utils/adjustTimezone';
import { convertUtcToTimezone } from '../../../utils/date';
import ActionGroup from '../../ActionGroup';
import { TextButton } from '../../Buttons';
import NotificationToaster from '../../NotificationToaster';

const useStyles = makeStyles(() => ({
  small: {
    maxWidth: 420,
  },
}));

export default function PreviewDateDialog(props) {
  const classes = useStyles(props);
  const [defaultDate] = useState(new Date());
  const { flowId, onClose, disabled, onRun, showWarning, dateSelected } = props;
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
    if (flowId) {
      dispatch(actions.flow.requestLastExportDateTime({ flowId }));
    }
  }, [dispatch, flowId]);
  const cancelDialog = useCallback(() => {
    onClose();
  }, [onClose]);

  useEffect(() => {
    fetchLastExportDateTime();
  }, [fetchLastExportDateTime]);

  const handleSubmit = formVal => {
    const customStartDate = adjustTimezone(formVal.startDateCustom, formVal.timeZone);

    onRun(customStartDate);

    onClose(false);
  };

  const fieldMeta = flowStartDateMetadata.getMetadata({
    timeZone,
    startDate: dateSelected || lastExportDateTime,
    format: `${preferences.dateFormat} ${preferences.timeFormat}`,
  });

  const formKey = useFormInitWithPermissions({
    disabled,
    fieldMeta,
  });

  if (!selectorStatus && flowId) {
    return <Spinner />;
  }

  if (selectorStatus === 'error') {
    onClose();
  }

  return (
    <ModalDialog show onClose={onClose}>
      <div>Delta preview</div>
      <div>
        {showWarning && (
        <NotificationToaster
          variant="warning"
          className={classes.small}
        >
          <Typography
            component="div"
            variant="h6">
            No records available to preview. Select an earlier start date/time and try again
          </Typography>
        </NotificationToaster>
        )}
        <DynaForm formKey={formKey} />
        <ActionGroup>
          <DynaSubmit
            ignoreFormTouchedCheck
            formKey={formKey}
            data-test="submit"
            onClick={handleSubmit}>
            Preview
          </DynaSubmit>
          <TextButton data-test="close" onClick={cancelDialog}>
            Cancel
          </TextButton>
        </ActionGroup>
      </div>
    </ModalDialog>
  );
}
