import React, { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { FormLabel, InputAdornment} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { endOfDay, addYears } from 'date-fns';
import { selectors } from '../../../../reducers';
import DateRangeSelector from '../../../DateRangeSelector';
import { getSelectedRange } from '../../../../utils/flowMetrics';
import FieldHelp from '../../FieldHelp';
import CalendarIcon from '../../../icons/CalendarIcon';
import DynaText from '../DynaText';
import actions from '../../../../actions';
import FieldMessage from '../FieldMessage';
import { message } from '../../../../utils/messageStore';

const useStyles = makeStyles(theme => ({
  iconWrapper: {
    '&:hover': {
      color: theme.palette.primary.main,
      backgroundColor: 'transparent',
    },
  },
  dynaTextWithCalendarIcon: {
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
    borderRadius: 2,
    paddingRight: theme.spacing(2),
    '& > * .MuiFilledInput-input': {
      borderColor: 'transparent',
      paddingRight: 0,
    },
    '&:hover': {
      borderColor: theme.palette.primary.main,
    },
  },

}));
const rangeFilters = [
  {id: 'after14days', label: '14 days'},
  {id: 'after30days', label: '30 days'},
  {id: 'after6months', label: '6 months'},
  {id: 'after1year', label: '1 year'},
  {id: 'custom', label: 'Custom'},
];
const defaultRange = {
  startDate: new Date(),
  endDate: endOfDay(new Date()),
  preset: null,
};
export default function DynaDateSelector(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { id, label, name, value, onFieldChange, required, isValid: isValidState, formKey, isLoggable} = props;
  const calendarIcon = () => <CalendarIcon className={classes.iconWrapper} />;
  const { dateFormat } = useSelector(state => selectors.userProfilePreferencesProps(state));
  const isValueParsableByMoment = useCallback(value =>
    (moment(value).isValid() && value?.length === dateFormat.length) || moment(value, moment.ISO_8601, true).isValid(), [dateFormat.length]);

  const isValid = isValueParsableByMoment(value);

  useEffect(() => {
    if (required || value) {
      if (isValid) {
        dispatch(actions.form.forceFieldState(formKey)(id, {isValid: true}));
      } else {
        dispatch(actions.form.forceFieldState(formKey)(id, {isValid, errorMessages: !value ? message.REQUIRED_MESSAGE : message.INVALID_DATE}));
      }
    }
  }, [id, dispatch, formKey, isValid, value, required]);

  // suspend force field state compuation once the component turns invisible
  useEffect(() => () => {
    dispatch(actions.form.clearForceFieldState(formKey)(id));
  }, [dispatch, formKey, id]);

  const handleFieldChange = useCallback((id, value) => {
    // isValueParsableByMoment checks for an incomplete form value or invalid date
    if (isValueParsableByMoment(value)) {
      onFieldChange(id, moment(value).endOf('day').toISOString());
    } else {
      onFieldChange(id, value);
    }
  }, [isValueParsableByMoment, onFieldChange]);

  const handleDateRangeChange = useCallback(dateFilter => {
    const filter = getSelectedRange(dateFilter);

    onFieldChange(id, moment(filter.endDate).toISOString());
  }, [id, onFieldChange]);

  return (
    <>
      <div className={classes.dynaDateLabelWrapper}>
        <FormLabel error={!isValidState} required={required}>{label}</FormLabel>
        <FieldHelp {...props} />
      </div>
      <DynaText
        id={id}
        name={name}
        type="date"
        placeholder={dateFormat}
        isLoggable={isLoggable}
        value={isValueParsableByMoment(value) ? moment(value).format(dateFormat) : value}
        className={classes.dynaTextWithCalendarIcon}
        onFieldChange={(id, value) => handleFieldChange(id, value)}
        endAdornment={(
          <InputAdornment position="end">
            <DateRangeSelector
              isCalendar
              value={defaultRange}
              toDate={addYears(new Date(), 1)}
              fromDate={new Date()}
              Icon={calendarIcon}
              customPresets={rangeFilters}
              showCustomRangeValue
              clearValue={defaultRange}
              onSave={handleDateRangeChange}
              showDateDisplay={false}
              showTime={false} />
          </InputAdornment>
        )}
      />
      <FieldMessage {...props} />
    </>
  );
}
