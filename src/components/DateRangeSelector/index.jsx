import { Button } from '@material-ui/core';
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
import { Fragment, useCallback, useState, useMemo } from 'react';
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
  startOfLastSevenDays: startOfDay(addDays(new Date(), -7)),
  startOfLastFifteenDays: startOfDay(addDays(new Date(), -15)),
  endOfLastThirtyDays: startOfDay(addDays(new Date(), -30)),
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
      endDate: defineds.endOfToday,
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
      startDate: defineds.startOfLastWeek,
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
const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
  },
  child: {
    flexBasis: '100%',
  },
}));

export default function DateRangeSelector({ value, onSave }) {
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
    () =>
      rangeList.map(rangeItem => ({
        ...staticRangeHandler,
        ...rangeItem,
      })),
    []
  );

  return (
    <Fragment>
      <Button onClick={toggleClick} variant="outlined" color="secondary">
        {getDurationLabel(selectedRanges)}
      </Button>
      <ArrowPopper
        open={!!anchorEl}
        anchorEl={anchorEl}
        placement="bottom-end"
        onClose={toggleClick}>
        {anchorEl && (
          <Fragment>
            <DateRangePicker
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
            <Button onClick={handleSave}>Apply</Button>
            <Button onClick={handleClose}>Cancel</Button>
          </Fragment>
        )}
      </ArrowPopper>
    </Fragment>
  );
}
