import { Button, Divider, List, ListItem, ListItemText } from '@material-ui/core';
// eslint-disable-next-line import/no-extraneous-dependencies
import { makeStyles } from '@material-ui/styles';
import moment from 'moment';
import {
  addDays,
  addHours,
  addMonths,
  endOfDay,
  endOfMonth,
  endOfWeek,
  startOfDay,
  startOfMonth,
  startOfWeek,
  addYears,
} from 'date-fns';
import React, { useCallback, useMemo, useState } from 'react';
import { DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import ArrowPopper from '../ArrowPopper';
import { getSelectedRange } from '../../utils/flowMetrics';

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
export const rangeList = [
  {
    label: 'Last 1 hour',
    range: () => ({
      startDate: new moment().subtract(1, 'hours').toDate(),
      endDate: new Date(),
    }),
  },
  {
    label: 'Last 4 hours',
    range: () => ({
      startDate: new moment().subtract(4, 'hours').toDate(),
      endDate: new Date(),
    }),
  },
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
      endDate: new Date(),
    }),
  },
  {
    label: 'Last 15 Days',
    range: () => ({
      startDate: defineds.startOfLastFifteenDays,
      endDate: new Date(),
    }),
  },
  {
    label: 'Last 30 Days',
    range: () => ({
      startDate: defineds.endOfLastThirtyDays,
      endDate: new Date(),
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

export const staticRangeHandler = {
  range: {},
  isSelected(range) {
    const definedRange = this.range();
    const definedRangeDistance = moment(definedRange.endDate).diff(moment(definedRange.startDate), 'hours');
    const rangeDistance = moment(range.endDate).diff(moment(range.startDate), 'hours');

    return definedRangeDistance === rangeDistance ||
      (definedRange.startDate === range.startDate && definedRange.endDate === range.endDate);
  },
};

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
  },
  listRoot: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  child: {
    flexBasis: '100%',
  },
  child1: {
    float: 'left',
    padding: theme.spacing(2),
    background: theme.palette.background.paper,
  },
  dateRangePickerWrapper: {
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(2),
    background: theme.palette.background.default,
  },
  actions: {
    paddingBottom: theme.spacing(2),
    marginTop: theme.spacing(2),
  },
  dateRangePopperBtn: {
    borderColor: theme.palette.secondary.lightest,
    minHeight: 38,
    color: theme.palette.secondary.light,
    fontFamily: 'source sans pro',
    fontSize: 15,
    '&:hover': {
      borderColor: theme.palette.secondary.lightest,
      color: theme.palette.secondary.light,
    },
  },
}));

export default function DateRangeSelector({ value, onSave, customPresets = [] }) {
  const [initalValue, setInitialValue] = useState(
    {
      ...getSelectedRange({preset: 'last24hours'}),
      ...(value?.startDate && { startDate: value.startDate }),
      ...(value?.endDate && { startDate: value.endDate }),
      ...(value?.preset && { preset: value.preset }),
    },
  );
  const [selectedRange, setSelectedRange] = useState(initalValue);
  const handleListItemClick = (event, id) => {
    setSelectedRange(state => ({...state, preset: id}));
  };
  const [anchorEl, setAnchorEl] = useState(null);
  const classes = useStyles();
  const presets = useMemo(() => [...customPresets, ...rangeList]
    .map(i => ({id: i.label.replace(/\s*/g, '').toLowerCase(), label: i.label}))
    .concat({id: 'custom', label: 'Custom'}), [customPresets]);
  const toggleClick = useCallback(event => {
    if (anchorEl) {
      setSelectedRange(initalValue);
    }
    setAnchorEl(state => (state ? null : event.currentTarget));
  }, [anchorEl, initalValue]);

  const handleSave = useCallback(() => {
    if (selectedRange.preset === 'lastrun') {
      const lastRunPreset = customPresets.find(preset => preset.label === 'Last run')?.range();

      selectedRange.startDate = lastRunPreset.startDate;
      selectedRange.endDate = lastRunPreset.endDate;
    }
    setInitialValue(selectedRange);
    onSave && onSave(selectedRange);
    setAnchorEl(null);
  }, [onSave, selectedRange]);

  const handleClose = useCallback(() => {
    setSelectedRange(initalValue);
    setAnchorEl(null);
  }, [initalValue]);

  const handleDateRangeSelection = useCallback(range => {
    setSelectedRange({ preset: 'custom', startDate: range.startDate, endDate: range.endDate });
  }, []);

  return (
    <>
      <Button
        onClick={toggleClick}
        variant="outlined"
        color="secondary"
        className={classes.dateRangePopperBtn}>
        {presets.find(preset => preset.id === selectedRange.preset)?.label || selectedRange.preset}
      </Button>
      <ArrowPopper
        open={!!anchorEl}
        anchorEl={anchorEl}
        placement="bottom-end"
        onClose={toggleClick}>
        {anchorEl && (
          <div className={classes.dateRangePickerWrapper}>
            <div >
              <div className={classes.child1}>
                <List>
                  {presets.map((m, i) => (
                    <div key={m.id}>
                      {!!i && <Divider />}
                      <ListItem
                        button
                        selected={selectedRange.preset === m.id}
                        onClick={event => handleListItemClick(event, m.id)}
                      >
                        <ListItemText secondary={m.label} />
                      </ListItem>
                    </div>
                  ))}

                </List>
              </div>
              {selectedRange.preset === 'custom' && (
              <div className={classes.child1}>
                <DateRangePicker
                  staticRanges={[]}
                  showSelectionPreview
                  onChange={item => handleDateRangeSelection(item.selection)}
                  moveRangeOnFirstSelection={false}
                  months={2}
                  className={classes.child}
                  ranges={[{...selectedRange, key: 'selection'}]}
                  direction="horizontal"
                  maxDate={new Date()}
                  minDate={addYears(new Date(), -1)}
                  inputRanges={[]}
                  showPreview={false}
                />
              </div>
              )}
            </div>
            <div className={classes.actions}>
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
