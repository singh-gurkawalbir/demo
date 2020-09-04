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
      <MuiPickersUtilsProvider utils={MomentDateFnsUtils} >
        <div className={classes.dateTimeWrapper}>
          <div className={classes.fieldWrapper}>
            <KeyboardDatePicker
              disabled={disabled}
              variant="inline"
              disableToolbar
              className={classes.keyBoardDateTimeWrapper}
              format={finalDateFormat}
              value={dateValue}
              fullWidth
              onChange={setDateValue}
              InputProps={{ className: classes.inputDateTime }}
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
              keyboardIcon={<CalendarIcon className={classes.iconWrapper} />}

      />
          </div>
          <div className={classes.fieldWrapper}>
            <KeyboardTimePicker
              disabled={disabled}
              variant="inline"
              fullWidth
              className={classes.keyBoardDateTimeWrapper}
              format={finalTimeFormat}
              value={dateValue}
              onChange={setDateValue}
              InputProps={{ className: classes.inputDateTime }}
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
              keyboardIcon={<AccessTimeIcon className={classes.iconWrapper} />}
      />
          </div>
        </div>
        <ErroredMessageComponent {...props} />
      </MuiPickersUtilsProvider>
    </>
  );
}
