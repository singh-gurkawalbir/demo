import MomentDateFnsUtils from '@date-io/moment';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
  KeyboardTimePicker,
} from '@material-ui/pickers';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import {FormLabel} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import FieldMessage from '../FieldMessage';
import { selectors } from '../../../../reducers';
import { convertUtcToTimezone } from '../../../../utils/date';
import FieldHelp from '../../FieldHelp';
import CalendarIcon from '../../../icons/CalendarIcon';
import actions from '../../../../actions';

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
  },
  iconWrapper: {
    '&:hover': {
      color: theme.palette.primary.main,
      backgroundColor: 'transparent',
    },
  },
}));

const FIXED_TIME_FORMAT = 'hh:mm:ss a';

export const FIXED_DATE_FORMAT = 'MM/DD/YYYY';
export const getDateMask = dateFormat => {
  if (!dateFormat) { return ''; }

  return dateFormat.split('').map(char => {
    if (char === 'D' || char === 'M' || char === 'Y') return '_';

    return char;
  }).join('');
};

const getTimeMask = timeMask => {
  if (!timeMask) { return ''; }

  // time format with meridian
  if (timeMask === 'h:mm:ss a' || timeMask === 'hh:mm:ss a') {
    return '__:__:__ _m';
  }

  // 24 hours format time
  return '__:__:__';
};

const useDatePickerProps = removePickerDialog => {
  const classes = useStyles();

  return removePickerDialog ? {
    InputAdornmentProps: {disablePointerEvents: true},
    keyboardIcon: null,
  } : {
    keyboardIcon: <CalendarIcon className={classes.iconWrapper} />,
  };
};
const useTimePickerProps = removePickerDialog => {
  const classes = useStyles();

  return removePickerDialog ? {
    InputAdornmentProps: {disablePointerEvents: true},
    keyboardIcon: null,
  } : {
    keyboardIcon: <AccessTimeIcon className={classes.iconWrapper} />,
  };
};
export default function DateTimePicker(props) {
  const classes = useStyles();
  const { id, label, timeLabel, dateLabel, required, formKey, onFieldChange, value = '', disabled, removePickerDialog, resourceContext, ssLinkedConnectionId, skipTimezoneConversion} = props;
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

  const datePickerProps = useDatePickerProps(removePickerDialog);
  const timePickerProps = useTimePickerProps(removePickerDialog);

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
      <MuiPickersUtilsProvider utils={MomentDateFnsUtils} >
        <div className={classes.dateTimeWrapper}>
          <div className={classes.fieldWrapper}>
            <KeyboardDatePicker
              disabled={disabled}
              variant="inline"
              format={FIXED_DATE_FORMAT}
              placeholder={FIXED_DATE_FORMAT}
              mask={getDateMask(FIXED_DATE_FORMAT)}
              value={dateValue}
              label={dateLabel || 'Date'}
              onChange={setFormatDateValue}
              disableToolbar
              className={classes.keyBoardDateTimeWrapper}
              fullWidth
              InputProps={{ className: classes.inputDateTime }}
              {...datePickerProps}
      />
          </div>
          <div className={classes.fieldWrapper}>
            <KeyboardTimePicker
              disabled={disabled}
              variant="inline"
              label={timeLabel || 'Time'}
              views={['hours', 'minutes', 'seconds']}
              format={FIXED_TIME_FORMAT}
              placeholder={FIXED_TIME_FORMAT}
              mask={getTimeMask(FIXED_TIME_FORMAT)}
              value={timeValue}
              onChange={setFormatTimeValue}
              fullWidth
              className={classes.keyBoardDateTimeWrapper}
              InputProps={{ className: classes.inputDateTime }}
              {...timePickerProps}
      />
          </div>
        </div>
        <FieldMessage {...props} />
      </MuiPickersUtilsProvider>
    </>
  );
}
