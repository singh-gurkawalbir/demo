import MomentDateFnsUtils from '@date-io/moment';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import {
  MuiPickersUtilsProvider,
  KeyboardDateTimePicker,
} from '@material-ui/pickers';
import ErroredMessageComponent from '../ErroredMessageComponent';
import CalendarIcon from '../../../icons/CalendarIcon';
import * as selectors from '../../../../reducers';
import { convertUtcToTimezone } from '../../../../utils/date';

export default function DateTimePicker(props) {
  const { id, label, onFieldChange, value = '', disabled, resourceContext } = props;
  const resourceType = resourceContext && resourceContext.resourceType;
  const resourceId = resourceContext && resourceContext.resourceId;
  const [dateValue, setDateValue] = useState(value || null);
  const [componentMounted, setComponentMounted] = useState(false);
  const isIAResource = useSelector(state => {
    const resource =
      selectors.resource(state, resourceType, resourceId) || {};

    return !!(resource && resource._connectorId);
  });
  const { dateFormat, timeFormat, timezone } = useSelector(state => {
    const { dateFormat, timeFormat, timezone } = selectors.userProfilePreferencesProps(state);

    return { dateFormat, timeFormat, timezone };
  }, shallowEqual);

  let userFormat;
  if (dateFormat) {
    if (timeFormat) {
      userFormat = `${dateFormat} ${timeFormat}`;
    } else {
      userFormat = `${dateFormat} h:mm:ss a`;
    }
  } else {
    userFormat = 'MM/DD/YYYY h:mm:ss a';
  }
  const displayFormat = props.format || userFormat;

  useEffect(() => {
    let formattedDate = null;

    if (isIAResource) {
      formattedDate = dateValue && moment(dateValue).toISOString();
    } else {
      formattedDate = dateValue && convertUtcToTimezone(
        moment(dateValue),
        dateFormat,
        timeFormat,
        timezone
      );
    }
    onFieldChange(id, formattedDate || '', !componentMounted);
    setComponentMounted(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateValue]);

  return (
    <MuiPickersUtilsProvider utils={MomentDateFnsUtils}>
      <KeyboardDateTimePicker
        label={label}
        format={displayFormat}
        value={dateValue}
        allowKeyboardControl={false}
        inputVariant="outlined"
        InputLabelProps={{
          shrink: true,
        }}
        onKeyDown={e => {
          // this is specifically for qa to inject their date time string
          // they should alter the input dom to add a qa attribute prior to injection for date time
          if (e.target.hasAttribute('qa')) return;

          e.preventDefault();
        }}
        onKeyPress={e => {
          if (e.target.hasAttribute('qa')) return;

          e.preventDefault();
        }}
        variant="dialog"
        invalidLabel={null}
        invalidDateMessage={null}
        onChange={setDateValue}
        disabled={disabled}
        clearable
        keyboardIcon={<CalendarIcon />}
      />
      <ErroredMessageComponent {...props} />
    </MuiPickersUtilsProvider>
  );
}
