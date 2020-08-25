import { Button } from '@material-ui/core';
// eslint-disable-next-line import/no-extraneous-dependencies
import { makeStyles } from '@material-ui/styles';
import {
  addYears,
} from 'date-fns';
import React, { useCallback, useState, useEffect, useMemo } from 'react';
import { DateRangePicker } from 'react-date-range';
import { getDurationLabel } from '../../../utils/flowMetrics';
import ArrowPopper from '../../ArrowPopper';
import { rangeList, staticRangeHandler } from '../../DateRangeSelector';

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

const rangeFilters = [
  'Today', 'Yesterday', 'Last 7 Days', 'Last 15 Days', 'Last 30 Days',
];

const dateRangeOptions = rangeList.filter(({label}) =>
  rangeFilters.includes(label)).map(rangeItem => ({
  ...staticRangeHandler,
  ...rangeItem,
}));
export default function DateRangeSelector({ value, onSave}) {
  const [selectedRanges, setSelectedRanges] = useState();

  const {endDate, startDate} = value?.[0] || {};

  useEffect(() => {
    setSelectedRanges(
      [
        {
          startDate,
          endDate,
          key: 'selection',
        },
      ]
    );
  }, [endDate, startDate]);
  const [anchorEl, setAnchorEl] = useState(null);
  const classes = useStyles();
  const toggleClick = useCallback(event => {
    setAnchorEl(state => (state ? null : event.currentTarget));
  }, []);

  const handleClose = useCallback(() => {
    setAnchorEl(null);
    setSelectedRanges([
      {
        endDate,
        startDate,
        key: 'selection',
      },
    ]);
  }, [endDate, startDate]);

  const handleSave = useCallback(() => {
    onSave && onSave(selectedRanges);
    setAnchorEl(null);
  }, [onSave, selectedRanges]);

  const handleClear = useCallback(() => {
    const emptyDateRange = [{startDate: null, endDate: null, key: 'selection'}];

    onSave && onSave(emptyDateRange);

    setAnchorEl(null);
  }, [onSave]);

  const finalSelectedRanges = useMemo(() => {
    const {endDate, startDate} = selectedRanges?.[0] || {};

    return [{

      endDate: endDate || new Date(),
      key: 'selection',

      startDate: startDate || new Date(),
    }];
  }, [selectedRanges]);

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
            editableDateInputs
            staticRanges={dateRangeOptions}
            showSelectionPreview
            onChange={item => setSelectedRanges([item.selection])}
            moveRangeOnFirstSelection={false}
            months={2}
            className={classes.child}
            ranges={finalSelectedRanges}
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
            <Button variant="text" color="primary" onClick={handleClear}>
              Clear
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

