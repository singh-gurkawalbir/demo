import { Button } from '@material-ui/core';
// eslint-disable-next-line import/no-extraneous-dependencies
import { makeStyles } from '@material-ui/styles';
import {
  addDays,
  addHours,
  addMonths,
  endOfDay,
  endOfMonth,
  endOfWeek,
  startOfDay,
  startOfMonth,
  isSameDay,
  startOfWeek,
  addYears,
} from 'date-fns';
import React, { useCallback, useState, useMemo } from 'react';
import { DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import ArrowPopper from '../ArrowPopper';
import { getDurationLabel } from '../../utils/flowMetrics';

const defineds = {
  startOfWeek: startOfWeek(new Date()),
  endOfWeek: endOfWeek(new Date()),
  startOfLastWeek: startOfWeek(addDays(new Date(), -7)),
  endOfLastWeek: endOfWeek(addDays(new Date(), -7)),
  startOfLastSevenDays: addDays(new Date(), -7),
  startOfLastFifteenDays: addDays(new Date(), -15),
  endOfLastThirtyDays: addDays(new Date(), -30),
  startOfToday: startOfDay(new Date()),
  endOfToday: endOfDay(new Date()),
  startOfYesterday: startOfDay(addDays(new Date(), -1)),
  endOfYesterday: endOfDay(addDays(new Date(), -1)),
  startOfMonth: startOfMonth(new Date()),
  endOfMonth: endOfMonth(new Date()),
  startOfLastMonth: startOfMonth(addMonths(new Date(), -1)),
  endOfLastMonth: endOfMonth(addMonths(new Date(), -1)),
};
const rangeList = [
  {
    label: 'Today',
    range: () => ({
      startDate: defineds.startOfToday,
      endDate: new Date(),
    }),
  },
  {
    label: 'Yesterday',
    range: () => ({
      startDate: defineds.startOfYesterday,
      endDate: defineds.endOfYesterday,
    }),
  },
  {
    label: 'Last 24 hours',
    range: () => ({
      startDate: addHours(new Date(), -24),
      endDate: new Date(),
    }),
  },
  {
    label: 'Last 7 Days',
    range: () => ({
      startDate: defineds.startOfLastSevenDays,
      endDate: defineds.endOfToday,
    }),
  },
  {
    label: 'Last 15 Days',
    range: () => ({
      startDate: defineds.startOfLastFifteenDays,
      endDate: defineds.endOfToday,
    }),
  },
  {
    label: 'Last 30 Days',
    range: () => ({
      startDate: defineds.endOfLastThirtyDays,
      endDate: defineds.endOfToday,
    }),
  },
  {
    label: 'Last 3 months',
    range: () => ({
      startDate: addMonths(new Date(), -3),
      endDate: new Date(),
    }),
  },
  {
    label: 'Last 6 months',
    range: () => ({
      startDate: addMonths(new Date(), -6),
      endDate: new Date(),
    }),
  },
  {
    label: 'Last 9 months',
    range: () => ({
      startDate: addMonths(new Date(), -9),
      endDate: new Date(),
    }),
  },
  {
    label: 'Last year',
    range: () => ({
      startDate: addYears(new Date(), -1),
      endDate: new Date(),
    }),
  },
];
const staticRangeHandler = {
  range: {},
  isSelected(range) {
    const definedRange = this.range();

    return (
      isSameDay(range.startDate, definedRange.startDate) &&
      isSameDay(range.endDate, definedRange.endDate)
    );
  },
};
const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
  },
  child: {
    flexBasis: '100%',
  },
  dateRangePickerWrapper: {
    display: 'flex',
    flexDirection: 'column',
  },
  dateRangePopperBtn: {
    borderColor: theme.palette.secondary.lightest,
    minHeight: 38,
    color: theme.palette.secondary.light,
    '&:hover': {
      borderColor: theme.palette.secondary.lightest,
      color: theme.palette.secondary.light,
    },
  },
}));

export default function DateRangeSelector({ value, rangesToInclude, onSave, shouldEditInput = false }) {
  const [selectedRanges, setSelectedRanges] = useState([
    {
      startDate:
        value && value.startDate
          ? new Date(value.startDate)
          : addHours(new Date(), -24),
      endDate: value && value.endDate ? new Date(value.endDate) : new Date(),
      key: 'selection',
    },
  ]);
  const [anchorEl, setAnchorEl] = useState(null);
  const classes = useStyles();
  const toggleClick = useCallback(event => {
    setAnchorEl(state => (state ? null : event.currentTarget));
  }, []);
  const handleSave = useCallback(() => {
    onSave && onSave(selectedRanges);
    setAnchorEl(null);
  }, [onSave, selectedRanges]);
  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);
  const dateRangeOptions = useMemo(
    () => (rangesToInclude
      ? rangeList.filter(({label}) =>
        rangesToInclude.includes(label))
      : rangeList).map(rangeItem => ({
      ...staticRangeHandler,
      ...rangeItem,
    })),
    [rangesToInclude]
  );

  return (
    <>
      <Button
        onClick={toggleClick}
        variant="outlined"
        color="secondary"
        className={classes.dateRangePopperBtn}>
        {getDurationLabel(selectedRanges)}
      </Button>
      <ArrowPopper
        open={!!anchorEl}
        anchorEl={anchorEl}
        placement="bottom-end"
        onClose={toggleClick}>
        {anchorEl && (
          <div className={classes.dateRangePickerWrapper}>
            <DateRangePicker
              editableDateInputs={shouldEditInput}
              staticRanges={dateRangeOptions}
              showSelectionPreview
              onChange={item => setSelectedRanges([item.selection])}
              moveRangeOnFirstSelection={false}
              months={2}
              className={classes.child}
              ranges={selectedRanges}
              direction="horizontal"
              maxDate={new Date()}
              minDate={addYears(new Date(), -1)}
              inputRanges={[]}
              showPreview={false}
            />
            <div>
              <Button variant="outlined" color="primary" onClick={handleSave}>
                Apply
              </Button>
              <Button variant="text" color="primary" onClick={handleClose}>
                Cancel
              </Button>
            </div>
          </div>
        )}
      </ArrowPopper>
    </>
  );
}
