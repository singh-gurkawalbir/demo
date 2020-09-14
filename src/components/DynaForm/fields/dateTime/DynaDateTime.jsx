import MomentDateFnsUtils from '@date-io/moment';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
  KeyboardTimePicker,
} from '@material-ui/pickers';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import {FormLabel} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import ErroredMessageComponent from '../ErroredMessageComponent';
import { selectors } from '../../../../reducers';
import { convertUtcToTimezone } from '../../../../utils/date';
import FieldHelp from '../../FieldHelp';
import CalendarIcon from '../../../icons/CalendarIcon';

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

const getDateAndTimeElements = str => {
  const displayFormatAr = str.split(' ');
  // date formats can be many check the profile component
  const date = displayFormatAr?.[0];

  let time = `${displayFormatAr?.[1]}`;

  // if meridian is present append it to format
  if (displayFormatAr?.[2]) {
    time = `${displayFormatAr?.[1]} ${displayFormatAr?.[2]}`;
  }

  // these are the two possible time formats
  if (time === 'h:mm:ss a' || time === 'hh:mm:ss a') { time = 'hh:mm:ss a'; } else if (time === 'H:mm:ss' || time === 'HH:mm:ss') { time = 'HH:mm:ss'; }

  return {date, time};
};
export default function DateTimePicker(props) {
  const classes = useStyles();
  const { id, label, onFieldChange, value = '', disabled, resourceContext} = props;
  const resourceType = resourceContext?.resourceType;
  const resourceId = resourceContext?.resourceId;
  const [dateValue, setDateValue] = useState(value || null);
  const [timeValue, setTimeValue] = useState(value || null);

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

    if (isIAResource) {
      formattedDate = dataTimeValueFormatted && moment(dataTimeValueFormatted).toISOString();
    } else {
      formattedDate = dataTimeValueFormatted && convertUtcToTimezone(
        moment(dataTimeValueFormatted),
        dateFormat,
        timeFormat,
        timezone
      );
    }
    onFieldChange(id, formattedDate || '', !componentMounted);
    setComponentMounted(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateValue, timeValue]);

  const { date: finalDateFormat, time: finalTimeFormat} = getDateAndTimeElements(displayFormat);

  return (
    <>
      <div className={classes.dynaDateTimeLabelWrapper}>
        <FormLabel>{label}</FormLabel>
        <FieldHelp {...props} />
      </div>
      <MuiPickersUtilsProvider utils={MomentDateFnsUtils} >
        <div className={classes.dateTimeWrapper}>
          <div className={classes.fieldWrapper}>
            <KeyboardDatePicker
              disabled={disabled}
              variant="inline"
              format={finalDateFormat}
              placeholder={finalDateFormat}
              mask={getDateMask(finalDateFormat)}
              value={dateValue}
              label="Date"
              onChange={setFormatDateValue}
              disableToolbar
              className={classes.keyBoardDateTimeWrapper}
              fullWidth
              InputProps={{ className: classes.inputDateTime }}
              keyboardIcon={<CalendarIcon className={classes.iconWrapper} />}

      />
          </div>
          <div className={classes.fieldWrapper}>
            <KeyboardTimePicker
              disabled={disabled}
              variant="inline"
              label="Time"
              views={['hours', 'minutes', 'seconds']}
              format={finalTimeFormat}
              placeholder={finalTimeFormat}
              mask={getTimeMask(finalTimeFormat)}
              value={timeValue}
              onChange={setFormatTimeValue}
              fullWidth
              className={classes.keyBoardDateTimeWrapper}
              InputProps={{ className: classes.inputDateTime }}
              keyboardIcon={<AccessTimeIcon className={classes.iconWrapper} />}
      />
          </div>
        </div>
        <ErroredMessageComponent {...props} />
      </MuiPickersUtilsProvider>
    </>
  );
}
