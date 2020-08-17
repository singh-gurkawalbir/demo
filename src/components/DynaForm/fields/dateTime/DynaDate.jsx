import MomentDateFnsUtils from '@date-io/moment';
import React, { useState, useEffect } from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import moment from 'moment';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import {FormLabel} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import ErroredMessageComponent from '../ErroredMessageComponent';
import CalendarIcon from '../../../icons/CalendarIcon';
import { selectors } from '../../../../reducers';
import { convertUtcToTimezone } from '../../../../utils/date';
import FieldHelp from '../../FieldHelp';

const useStyles = makeStyles(theme => ({
  dynaDateLabelWrapper: {
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
export default function DatePicker(props) {
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
    <>
      <div className={classes.dynaDateLabelWrapper}>
        <FormLabel>{label}</FormLabel>
        <FieldHelp {...props} />
      </div>
      <MuiPickersUtilsProvider utils={MomentDateFnsUtils} variant="filled">
        <KeyboardDatePicker
          format={displayFormat}
          value={dateValue}
          invalidLabel={null}
          invalidDateMessage={null}
          inputVariant="filled"
          InputLabelProps={{ shrink: true }}
          onChange={setDateValue}
          disabled={disabled}
          clearable
          KeyboardButtonProps={{className: classes.dynaDateCalendarBtn}}
          keyboardIcon={<CalendarIcon />}
      />
        <ErroredMessageComponent {...props} />
      </MuiPickersUtilsProvider>
    </>
  );
}
