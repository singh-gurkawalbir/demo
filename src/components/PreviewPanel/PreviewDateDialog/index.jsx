import React, { useEffect, useMemo, useState } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { selectors } from '../../../reducers';
import actions from '../../../actions';
import ModalDialog from '../../ModalDialog';
import DynaForm from '../../DynaForm';
import DynaSubmit from '../../DynaForm/DynaSubmit';
import flowStartDateMetadata from './metadata';
import useFormInitWithPermissions from '../../../hooks/useFormInitWithPermissions';
import adjustTimezone from '../../../utils/adjustTimezone';
import { convertUtcToTimezone, getNDaysBeforeDate } from '../../../utils/date';
import ActionGroup from '../../ActionGroup';
import { TextButton } from '../../Buttons';
import NotificationToaster from '../../NotificationToaster';
import { isNewId } from '../../../utils/resource';

const useStyles = makeStyles(() => ({
  small: {
    maxWidth: 420,
  },
}));

export default function PreviewDateDialog(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { flowId, onClose, disabled, onRun, dateSelected, timeZoneSelected } = props;
  const [defaultDate] = useState(getNDaysBeforeDate(1));
  const { preferences, timeZone, origLastExportDateTime } = useSelector(state => ({
    origLastExportDateTime: selectors.getLastExportDateTime(state, flowId)?.data,
    timeZone: selectors.userTimezone(state),
    preferences: selectors.userOwnPreferences(state),
  }), shallowEqual);
  const lastExportDateTime = useMemo(() =>
    convertUtcToTimezone(origLastExportDateTime || defaultDate, preferences.dateFormat, preferences.timeFormat, timeZone, {skipFormatting: true}),
  [defaultDate, origLastExportDateTime, preferences.dateFormat, preferences.timeFormat, timeZone]
  );

  useEffect(() => {
    if (flowId && !isNewId(flowId)) {
      dispatch(actions.flow.requestLastExportDateTime({ flowId }));
    }
  }, [dispatch, flowId]);

  const handleSubmit = formVal => {
    const customStartDate = adjustTimezone(formVal.startDateCustom, formVal.timeZone);

    onRun(customStartDate, {timeZone: formVal.timeZone, startDateCustom: formVal.startDateCustom});
    onClose(false);
  };

  const fieldMeta = flowStartDateMetadata.getMetadata({
    timeZone: timeZoneSelected || timeZone,
    startDate: dateSelected || lastExportDateTime,
    format: `${preferences.dateFormat} ${preferences.timeFormat}`,
  });

  const formKey = useFormInitWithPermissions({
    disabled,
    fieldMeta,
  });

  return (
    <ModalDialog show onClose={onClose}>
      <div>Delta preview</div>
      <div>
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
        <DynaForm formKey={formKey} />
        <ActionGroup>
          <DynaSubmit
            ignoreFormTouchedCheck
            formKey={formKey}
            data-test="submit"
            onClick={handleSubmit}>
            Preview
          </DynaSubmit>
          <TextButton data-test="close" onClick={onClose}>
            Cancel
          </TextButton>
        </ActionGroup>
      </div>
    </ModalDialog>
  );
}
