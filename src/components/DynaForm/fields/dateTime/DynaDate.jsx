import MomentDateFnsUtils from '@date-io/moment';
import React, { useState, useEffect } from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import moment from 'moment';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import ErroredMessageComponent from '../ErroredMessageComponent';
import CalendarIcon from '../../../icons/CalendarIcon';
import * as selectors from '../../../../reducers';
import { convertUtcToTimezone } from '../../../../utils/date';

export default function DatePicker(props) {
  const { id, label, onFieldChange, value = '', disabled, resourceContext } = props;
  const resourceType = resourceContext?.resourceType;
  const resourceId = resourceContext?.resourceId;
  const [dateValue, setDateValue] = useState(value || null);
  const [componentMounted, setComponentMounted] = useState(false);
  const isIAResource = useSelector(state => {
    const resource =
      selectors.resource(state, resourceType, resourceId) || {};

    return !!(resource?._connectorId);
  });
  const { dateFormat, timezone } = useSelector(state => {
    const { dateFormat, timezone } = selectors.userProfilePreferencesProps(state);

    return { dateFormat, timezone };
  }, shallowEqual);
  const displayFormat = props.format || dateFormat || 'MM/DD/YYYY';

  useEffect(() => {
    let formattedDate = null;

    if (isIAResource) {
      formattedDate = dateValue && moment(dateValue).toISOString();
    } else {
      formattedDate = dateValue && convertUtcToTimezone(
        moment(dateValue),
        dateFormat,
        null,
        timezone,
        true
      );
    }
    onFieldChange(id, formattedDate || '', !componentMounted);
    setComponentMounted(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateValue]);

  return (
    <MuiPickersUtilsProvider utils={MomentDateFnsUtils}>
      <KeyboardDatePicker
        label={label}
        format={displayFormat}
        value={dateValue}
        invalidLabel={null}
        invalidDateMessage={null}
        inputVariant="outlined"
        InputLabelProps={{ shrink: true }}
        onChange={setDateValue}
        disabled={disabled}
        clearable
        keyboardIcon={<CalendarIcon />}
      />
      <ErroredMessageComponent {...props} />
    </MuiPickersUtilsProvider>
  );
}
