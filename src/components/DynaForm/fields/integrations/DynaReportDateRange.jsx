
import { FormLabel, Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import React, { useCallback, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import subDays from 'date-fns/subDays';
import moment from 'moment';
import { selectors } from '../../../../reducers';
import { getSelectedRange } from '../../../../utils/flowMetrics';
import DateRangeSelector from '../../../DateRangeSelector';
import DynaDateTime from '../dateTime/DynaDateTime';
import FieldMessage from '../FieldMessage';
import FieldHelp from '../../FieldHelp';

export const EVENT_REPORTS_DEFAULT = [
  {id: 'lastmin', label: 'Last minute'},
  {id: 'last5min', label: 'Last 5 minutes'},
  {id: 'last15minutes', label: 'Last 15 minutes'},
  {id: 'last30minutes', label: 'Last 30 minutes'},
  {id: 'last1hour', label: 'Last hour'},
  {id: 'last6hours', label: 'Last 6 hours'},
  {id: 'last12hours', label: 'Last 12 hours '},
  {id: 'last24hours', label: 'Last 24 hours'},
  {id: 'custom', label: 'Custom'},
];
const useStyles = makeStyles(theme => ({
  infoText: {
    marginTop: theme.spacing(2),
  },
  filterTimeStampPopper: {
    top: '5px !important',
    zIndex: 1300,
  },
  filterTimeStampPopperArrow: {
    left: '90% !important',
  },
  filterTimeStampPopperExpand: {
    left: '0% !important',
  },
  filterTimeStampArrowPopperExpand: {
    left: '98% !important',
  },
}));
const WINDOW_LIMIT = 30;
const selectedRangeConstraint = (startDate, endDate) => {
  if (!endDate || !startDate) return true;
  // start date and end date should not exceed more than 30 days from today
  if (moment().diff(moment(startDate), 'days') > WINDOW_LIMIT) return false;
  if (moment().diff(moment(endDate), 'days') > WINDOW_LIMIT) return false;
  const diffDays = moment(endDate).diff(moment(startDate), 'days');

  return diffDays < 3 && diffDays >= 0;
};

function CustomTextFields({selectedRange, setSelectedRange, reset, setReset}) {
  const classes = useStyles();
  const {startDate, preset, endDate} = selectedRange;

  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // when opening custom text field without a selected range default it to 24hrs
    if (!startDate && !endDate) {
      setSelectedRange({...getSelectedRange({preset: 'last24hours'}), preset: 'custom' });
      setReset(state => !state);
    }
    setLoaded(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (preset !== 'custom') { return null; }

  const onFieldChange = key => (id, value, mounted, isValid) => {
    setSelectedRange(state => {
      if (!loaded) return state;
      const stateCopy = {...state};

      if (!isValid) { return state; }
      stateCopy[key] = moment(value)?.toDate?.();
      const {startDate, endDate} = stateCopy;

      if (!selectedRangeConstraint(startDate, endDate)) {
        setReset(state => !state);

        return state;
      }

      return stateCopy;
    });
  };

  return (
    <>
      <div>
        <DynaDateTime
          key={reset}
          id="startDate"
          dateLabel="Start date"
          timeLabel="Start time"
          onFieldChange={onFieldChange}
          value={startDate} skipTimezoneConversion
          removePickerDialog
          />
      </div>
      <div>
        <DynaDateTime
          key={reset}
          id="endDate"
          dateLabel="End date"
          timeLabel="End time"
          onFieldChange={onFieldChange}
          value={endDate} skipTimezoneConversion
          removePickerDialog
          />
      </div>
      <Typography className={classes.infoText}>You can generate a report for up to 3 days of data.</Typography>
    </>

  );
}
export default function DynaReportDateRange(props) {
  const classes = useStyles();
  const {id, onFieldChange, required, label, value, formKey, isValid} = props;
  const ranges = EVENT_REPORTS_DEFAULT.map(({id, ...rest}) => ({...rest, id, ...getSelectedRange({preset: id})}));
  const timezone = useSelector(state => selectors.userTimezone(state));
  const selectedIntegration = useSelector(state => selectors.formState(state, formKey)?.fields?.integration?.value);

  const onSave = useCallback(selectedRange => {
    if (!selectedRange || !selectedRange.preset) {
      return onFieldChange(id, value);
    }

    const {startDate, endDate, preset } = selectedRange;

    if (preset === 'custom') {
      if (!startDate && !endDate) { return onFieldChange(id, null); }

      return onFieldChange(id, {startDate: startDate.toISOString(),
        timezone,
        preset,
        endDate: endDate.toISOString()});
    }
    const r = getSelectedRange({preset});
    const {startDate: presetStartDate, endDate: presetEndDate} = r;

    return onFieldChange(id, {
      startDate: presetStartDate.toISOString(),
      preset,
      timezone,
      endDate: presetEndDate.toISOString() });
  }, [id, onFieldChange, timezone, value]);
  const disabled = !selectedIntegration;

  return (
    <>
      <FormLabel
        disabled={disabled}
        required={required}
        error={!isValid}
      > {label}
      </FormLabel>
      <FieldHelp {...props} />
      <div>
        <DateRangeSelector
          {...props}
          disabled={disabled}
          showDateDisplay={false}
          fullWidthBtn
          classProps={classes}
          customPresets={ranges}
          showCustomRangeValue
          editableDateInputs={false}
          defaultPreset={value}
          selectedRangeConstraint={selectedRangeConstraint}
          onSave={onSave}
          fromDate={subDays(new Date(), WINDOW_LIMIT - 1)}
          CustomTextFields={CustomTextFields}
      />
        <FieldMessage {...props} />
      </div>

    </>
  );
}

