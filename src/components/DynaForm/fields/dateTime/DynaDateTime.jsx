import MomentDateFnsUtils from '@date-io/moment';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import {
  MuiPickersUtilsProvider,
  DatePicker,
  TimePicker,
} from '@material-ui/pickers';
import {FormLabel} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import ErroredMessageComponent from '../ErroredMessageComponent';
import { selectors } from '../../../../reducers';
import { convertUtcToTimezone } from '../../../../utils/date';
import FieldHelp from '../../FieldHelp';

const useStyles = makeStyles(theme => ({
  dynaDateTimeLabelWrapper: {
    flexDirection: 'row !important',
  },
  dynaDateCalendarBtn: {
    padding: 0,
    '&:hover': {
      background: 'transparent',
      '& > span': {
        color: theme.palette.primary.main,
      },
    },
  },
}));
export default function DateTimePicker(props) {
  const classes = useStyles();
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
  const { dateFormat, timeFormat, timezone } = useSelector(state => selectors.userProfilePreferencesProps(state), shallowEqual);

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

  const displayFormatAr = displayFormat.split(' ');
  const finalDateFormat = displayFormatAr?.[0];
  const finalTimeFormat = `${displayFormatAr?.[1]} ${displayFormatAr?.[2]}`;

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
    <>
      <div className={classes.dynaDateTimeLabelWrapper}>
        <FormLabel>{label}</FormLabel>
        <FieldHelp {...props} />
      </div>
      <MuiPickersUtilsProvider utils={MomentDateFnsUtils}>
        <DatePicker
          disabled={disabled}
          variant="inline"
          format={finalDateFormat}
          value={dateValue}
          label="Date"
          onChange={setDateValue}
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
      />

        <TimePicker
          disabled={disabled}
          variant="inline"
          label="Time"
          format={finalTimeFormat}
          value={dateValue}
          onChange={setDateValue}
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
      />
        <ErroredMessageComponent {...props} />
      </MuiPickersUtilsProvider>
    </>
  );
}
