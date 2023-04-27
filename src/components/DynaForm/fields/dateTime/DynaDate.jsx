import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import React, { useState, useEffect } from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import moment from 'moment';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {FormLabel} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import FieldMessage from '../FieldMessage';
import { selectors } from '../../../../reducers';
import { convertUtcToTimezone } from '../../../../utils/date';
import FieldHelp from '../../FieldHelp';
import CalendarIcon from '../../../icons/CalendarIcon';
import isLoggableAttr from '../../../../utils/isLoggableAttr';

const useStyles = makeStyles(theme => ({
  dynaDateLabelWrapper: {
    flexDirection: 'row !important',
    display: 'flex',
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
  keyBoardDateWrapper: {

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
  inputDate: {
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
export default function DynaDate(props) {
  const classes = useStyles();
  const { id, label, onFieldChange, value = '', disabled, resourceContext, ssLinkedConnectionId, closeOnSelect, isLoggable, doNotAllowFutureDates } = props;
  const resourceType = resourceContext?.resourceType;
  const resourceId = resourceContext?.resourceId;
  const [dateValue, setDateValue] = useState(value || null);
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
  const { dateFormat, timezone } = useSelector(state => selectors.userProfilePreferencesProps(state), shallowEqual);

  useEffect(() => {
    let formattedDate = null;

    // suitescript connectors expect isostring format
    if (isIAResource || isSuiteScriptConnector) {
      formattedDate = dateValue && moment(dateValue).toISOString();
    } else {
      formattedDate = dateValue && convertUtcToTimezone(
        moment(dateValue),
        dateFormat,
        null,
        timezone,
        {dateOnly: true}
      );
    }
    onFieldChange(id, formattedDate || '', !componentMounted);
    setComponentMounted(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateValue]);

  return (
    <>
      <div className={classes.dynaDateLabelWrapper}>
        <FormLabel>{label}</FormLabel>
        <FieldHelp {...props} />
      </div>
      <LocalizationProvider dateAdapter={AdapterMoment} variant="filled">
        <DatePicker
          {...isLoggableAttr(isLoggable)}
          // disableToolbar
          disabled={disabled}
          // className={classes.keyBoardDateWrapper}
          // variant="inline"
          closeOnSelect={closeOnSelect}
          value={dateValue}
          onChange={setDateValue}
          slots={{openPickerIcon: CalendarIcon }}
          disableFuture={props.disableFuture}
          maxDate={doNotAllowFutureDates && moment()}
          format={dateFormat}
          onKeyDown={e => {
            // this is specifically for qa to inject their date time string
            // they should alter the input dom to add a qa attribute prior to injection for date time
            if (e.keyCode === 8 || e.keyCode === 46) {
              setDateValue(null);
            }
            if (e.target.hasAttribute('qa')) return;

            e.preventDefault();
          }}
          onKeyPress={e => {
            if (e.target.hasAttribute('qa')) return;

            e.preventDefault();
          }}
          // InputProps={{ className: classes.   }}
          />
        <FieldMessage {...props} />
      </LocalizationProvider>
    </>
  );
}
