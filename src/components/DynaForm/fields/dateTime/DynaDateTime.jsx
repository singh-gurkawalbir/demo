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

const useStyles = makeStyles(theme => ({
  dynaDateTimeLabelWrapper: {
    flexDirection: 'row !important',
    display: 'flex',
  },
  dateTimeWrapper: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
  },
  fieldWrapper: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    '&:first-child': {
      marginRight: theme.spacing(1),
    },
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
  const { id, onFieldChange, value = '', disabled, resourceContext } = props;
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
      <MuiPickersUtilsProvider utils={MomentDateFnsUtils} >
        <div className={classes.dateTimeWrapper}>
          <div className={classes.fieldWrapper}>
            <FormLabel>Start date</FormLabel>
            <DatePicker
              disabled={disabled}
              variant="inline"
              inputVariant="filled"
              disableToolbar
              format={finalDateFormat}
              value={dateValue}
              fullWidth
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
          </div>
          <div className={classes.fieldWrapper}>
            <FormLabel>Start time</FormLabel>
            <TimePicker
              disabled={disabled}
              variant="inline"
              inputVariant="filled"
              fullWidth
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
          </div>
          <ErroredMessageComponent {...props} />
        </div>
      </MuiPickersUtilsProvider>
    </>
  );
}
