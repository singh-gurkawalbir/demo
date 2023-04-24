import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import {FormLabel} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import FieldMessage from '../FieldMessage';
import { selectors } from '../../../../reducers';
import { convertUtcToTimezone } from '../../../../utils/date';
import FieldHelp from '../../FieldHelp';
import CalendarIcon from '../../../icons/CalendarIcon';
import actions from '../../../../actions';
import isLoggableAttr from '../../../../utils/isLoggableAttr';

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
  keyBoardDateTimeWrapper: {
    '& .MuiIconButton-root': {
      padding: 0,
      marginRight: theme.spacing(1),
      backgroundColor: 'transparent',
    },
    '& .MuiInputBase-input': {
      padding: 0,
      height: 38,
      paddingLeft: 15,
    },
  },
  inputDateTime: {
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
    borderRadius: 2,
    '&:hover': {
      border: `1px solid ${theme.palette.primary.main}`,
    },
  },
  iconWrapper: {
    '&:hover': {
      color: theme.palette.primary.main,
      backgroundColor: 'transparent',
    },
  },
}));

export default function DateTimePicker(props) {
  const classes = useStyles();
  const { id, label, timeLabel, dateLabel, required, formKey, onFieldChange, value = '', disabled, resourceContext, ssLinkedConnectionId, skipTimezoneConversion, isLoggable, doNotAllowFutureDates} = props;
  const resourceType = resourceContext?.resourceType;
  const resourceId = resourceContext?.resourceId;
  const [dateValue, setDateValue] = useState(value || null);
  const [timeValue, setTimeValue] = useState(value || null);
  const dispatch = useDispatch();
  const setFormatTimeValue = dateTimeValue => {
    if (dateTimeValue) {
      // some dummy year dates we only care about the time
      dateTimeValue.set('year', 2000);
      dateTimeValue.set('month', 1);
      dateTimeValue.set('date', 1);
    }
    setTimeValue(dateTimeValue);
  };
  const preferences = useSelector(state => selectors.userOwnPreferences(state));
  const timeZone = useSelector(state => selectors.userTimezone(state));

  const setFormatDateValue = dateTimeValue => {
    if (dateTimeValue) {
      // some dummy time we only care about the date
      dateTimeValue.set('hour', 0);
      dateTimeValue.set('minute', 0);
      dateTimeValue.set('second', 0);
    }
    setDateValue(dateTimeValue);
  };
  const [componentMounted, setComponentMounted] = useState(false);
  const isIAResource = useSelector(state => {
    const resource =
      selectors.resource(state, resourceType, resourceId) || {};

    return !!(resource?._connectorId);
  });

  const isSuiteScriptConnector = useSelector(state => {
    const preferences = selectors.userPreferences(state);

    return preferences?.ssConnectionIds?.includes(ssLinkedConnectionId);
  });
  const { dateFormat, timeFormat, timezone } = useSelector(state => selectors.userProfilePreferencesProps(state), shallowEqual);
  const isEnteredDateAndTimeValue = moment(dateValue)?.isValid?.() && moment(timeValue)?.isValid?.();

  useEffect(() => {
    if (required) {
      if (isEnteredDateAndTimeValue) {
        dispatch(actions.form.forceFieldState(formKey)(id, {isValid: true}));

        return;
      }

      dispatch(actions.form.forceFieldState(formKey)(id, {isValid: false, errorMessages: value ? 'Invalid date time value' : 'A value must be provided' }));
    }
  },
  [dispatch, formKey, id, isEnteredDateAndTimeValue, required, value]);

  // suspend force field state computation once the component turns invisible
  useEffect(() => () => {
    dispatch(actions.form.clearForceFieldState(formKey)(id));
  }, [dispatch, formKey, id]);
  useEffect(() => {
    let formattedDate = null;
    const dataTimeValueFormatted = moment();

    // eslint-disable-next-line no-bitwise
    doNotAllowFutureDates && (dateValue ^ timeValue) && setComponentMounted(true);
    if (!dateValue || !timeValue) {
      onFieldChange(id, '', !componentMounted);

      return;
    }
    dataTimeValueFormatted.set('year', moment(dateValue)?.get('year') || 0);
    dataTimeValueFormatted.set('month', moment(dateValue)?.get('month') || 0);
    dataTimeValueFormatted.set('date', moment(dateValue)?.get('date') || 0);
    dataTimeValueFormatted.set('hour', moment(timeValue)?.get('hour') || 0);
    dataTimeValueFormatted.set('minute', moment(timeValue)?.get('minute') || 0);
    dataTimeValueFormatted.set('second', moment(timeValue)?.get('second') || 0);
    // suitescript connectors expect isostring format
    if (isIAResource || isSuiteScriptConnector || skipTimezoneConversion) {
      formattedDate = dataTimeValueFormatted && moment(dataTimeValueFormatted).toISOString();
    } else {
      formattedDate = dataTimeValueFormatted && convertUtcToTimezone(
        moment(dataTimeValueFormatted),
        dateFormat,
        timeFormat,
        timezone
      );
    }
    onFieldChange(id, formattedDate || '', !componentMounted, isEnteredDateAndTimeValue);
    setComponentMounted(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateValue, timeValue]);

  return (
    <>
      <div className={classes.dynaDateTimeLabelWrapper}>
        {label && (
        <>
          <FormLabel>{label}</FormLabel>
          <FieldHelp {...props} />
        </>
        )}
      </div>
      <LocalizationProvider dateAdapter={AdapterMoment} variant="filled">
        <div className={classes.dateTimeWrapper}>
          <div className={classes.fieldWrapper}>
            <DatePicker
              maxDate={doNotAllowFutureDates && moment()}
              {...isLoggableAttr(isLoggable)}
              disabled={disabled}
              data-test="date"
              format={dateFormat}
              value={convertUtcToTimezone(dateValue || new Date(), preferences.dateFormat, preferences.timeFormat, timeZone, {skipFormatting: true})}
              onChange={setFormatDateValue}
              label={dateLabel || 'Date'}
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
              slots={{openPickerIcon: CalendarIcon }}
            />
          </div>
          <div className={classes.fieldWrapper}>
            <MobileTimePicker
              {...isLoggableAttr(isLoggable)}
              disabled={disabled}
              data-test="time"
              label={timeLabel || 'Time'}
              views={['hours', 'minutes', 'seconds']}
              format={timeFormat}
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
              value={convertUtcToTimezone(timeValue || new Date(), preferences.dateFormat, preferences.timeFormat, timeZone, {skipFormatting: true})}
              onChange={setFormatTimeValue}
              slots={{openPickerIcon: AccessTimeIcon}}
            />
          </div>
        </div>
        <FieldMessage {...props} />
      </LocalizationProvider>
    </>
  );
}
