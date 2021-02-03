import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { FormLabel, InputAdornment} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { endOfDay, addYears } from 'date-fns';
import { selectors } from '../../../../reducers';
import DateRangeSelector from '../../../DateRangeSelector';
import { convertUtcToTimezone } from '../../../../utils/date';
import { getSelectedRange } from '../../../../utils/flowMetrics';
import FieldHelp from '../../FieldHelp';
import CalendarIcon from '../../../icons/CalendarIcon';
import DynaText from '../DynaText';

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
  const { id, label, name, value, onFieldChange, required } = props;
  const calendarIcon = () => <CalendarIcon className={classes.iconWrapper} />;
  const { dateFormat } = useSelector(state => selectors.userProfilePreferencesProps(state));
  const timezone = useSelector(state => selectors.userTimezone(state));

  const handleFieldChange = useCallback((id, value) => {
    onFieldChange(id, value);
  }, [onFieldChange]);

  const handleDateRangeChange = useCallback(dateFilter => {
    const filter = getSelectedRange(dateFilter);
    const expireDate = convertUtcToTimezone(
      moment(filter.endDate),
      dateFormat,
      null,
      timezone,
      {dateOnly: true}
    );

    onFieldChange(id, expireDate);
  }, [id, onFieldChange, dateFormat, timezone]);

  return (
    <>
      <div className={classes.dynaDateLabelWrapper}>
        <FormLabel required={required}>{label}</FormLabel>
        <FieldHelp {...props} />
      </div>
      <DynaText
        id={id}
        name={name}
        type="date"
        placeholder={dateFormat}
        value={value}
        className={classes.dynaTextWithCalendarIcon}
        onFieldChange={(id, value) => handleFieldChange(id, value)}
        endAdornment={(
          <InputAdornment position="end">
            <DateRangeSelector
              value={defaultRange}
              toDate={addYears(new Date(), 1)}
              fromDate={new Date()}
              clearable
              Icon={calendarIcon}
              customPresets={rangeFilters}
              clearValue={defaultRange}
              onSave={handleDateRangeChange}
              showTime={false} />
          </InputAdornment>
        )}
      />
    </>
  );
}
