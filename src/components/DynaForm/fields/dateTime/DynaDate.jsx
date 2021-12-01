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
import FieldMessage from '../FieldMessage';
import { selectors } from '../../../../reducers';
import { convertUtcToTimezone } from '../../../../utils/date';
import FieldHelp from '../../FieldHelp';
import CalendarIcon from '../../../icons/CalendarIcon';

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
  const { id, label, onFieldChange, value = '', disabled, resourceContext, ssLinkedConnectionId, closeOnSelect } = props;
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
      <MuiPickersUtilsProvider utils={MomentDateFnsUtils} variant="filled">

        <KeyboardDatePicker
          autoOk={closeOnSelect}
          disableToolbar
          disabled={disabled}
          className={classes.keyBoardDateWrapper}
          variant="inline"
          fullWidth
          format={dateFormat}
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
          value={dateValue}
          onChange={setDateValue}
          InputProps={{ className: classes.inputDate }}
          keyboardIcon={<CalendarIcon className={classes.iconWrapper} />}
          />
        <FieldMessage {...props} />
      </MuiPickersUtilsProvider>
    </>
  );
}
