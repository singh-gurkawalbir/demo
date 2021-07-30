import { List, ListItem, ListItemText } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import addYears from 'date-fns/addYears';
import React, { useCallback, useMemo, useState } from 'react';
import clsx from 'clsx';
import { DateRangePicker, Calendar } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import startOfDay from 'date-fns/startOfDay';
import endOfDay from 'date-fns/endOfDay';
import ArrowPopper from '../ArrowPopper';
import { getSelectedRange } from '../../utils/flowMetrics';
import ActionButton from '../ActionButton';
import ArrowDownIcon from '../icons/ArrowDownIcon';
import {FilledButton, OutlinedButton, TextButton} from '../Buttons/index';
import ActionGroup from '../ActionGroup';

const defaultPresets = [
  {id: 'last1hour', label: 'Last 1 hour'},
  {id: 'last4hours', label: 'Last 4 hours'},
  {id: 'last24hours', label: 'Last 24 hours'},
  {id: 'today', label: 'Today'},
  {id: 'yesterday', label: 'Yesterday'},
  {id: 'last7days', label: 'Last 7 days'},
  {id: 'last15days', label: 'Last 15 days'},
  {id: 'last30days', label: 'Last 30 days'},
  {id: 'last3months', label: 'Last 3 months'},
  {id: 'last6months', label: 'Last 6 months'},
  {id: 'last9months', label: 'Last 9 months'},
  {id: 'lastyear', label: 'Last year'},
  {id: 'custom', label: 'Custom'},
];

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
  leftItems: {
    float: 'left',
  },
  leftItemsList: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gridColumnGap: theme.spacing(2),
  },
  dateRangePickerWrapper: {
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(2),
    background: theme.palette.background.default,

  },
  actions: {
    marginTop: theme.spacing(2),
  },
  dateRangePopperBtn: {
    borderColor: theme.palette.secondary.lightest,
    minHeight: 36,
    color: theme.palette.secondary.main,
    fontFamily: 'source sans pro',
    fontSize: 15,
    padding: [[0, 12]],
    lineHeight: 2,
    '&:hover': {
      borderColor: theme.palette.primary.main,
      color: theme.palette.secondary.dark,
    },
  },
  parentPicker: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  listBtn: {
    background: theme.palette.common.white,
    marginBottom: theme.spacing(1),
    border: '1px solid',
    minWidth: 212,
    height: theme.spacing(4),
    borderColor: theme.palette.secondary.lightest,
    borderRadius: theme.spacing(0.5),
    '& > * .MuiTypography-root': {
      textAlign: 'center',
    },
    '&.Mui-selected': {
      background: theme.palette.primary.dark,
      borderColor: theme.palette.primary.dark,
      '& > * .MuiTypography-root': {
        color: theme.palette.common.white,
      },
      '&:hover': {
        background: theme.palette.primary.dark,
        borderColor: theme.palette.primary.dark,
      },
    },
    '&:hover': {
      borderColor: theme.palette.primary.dark,
      background: theme.palette.primary.dark,
      '& > * .MuiTypography-root': {
        color: theme.palette.common.white,
      },
    },
  },
  rightCalendar: {
    marginLeft: theme.spacing(2),
  },
  dateRangePopperBtnFull: {
    width: '100%',
    justifyContent: 'flex-start',
    padding: [[6, 12]],
    '& > .MuiButton-label': {
      justifyContent: 'space-between',
    },
    '&:hover': {
      color: theme.palette.secondary.main,
    },
  },
}));
const DateRange = props => {
  const { isCalendar, setSelectedRange, ranges } = props;
  const handleDateRangeSelection = useCallback(({ selection: range }) => {
    let { startDate, endDate } = range;

    if (startDate.getTime() === endDate.getTime() && endDate.getTime() === startOfDay(endDate).getTime()) {
      startDate = startOfDay(startDate);
      endDate = endOfDay(endDate);
    }
    setSelectedRange({ preset: 'custom', startDate, endDate });
  }, [setSelectedRange]);
  const handleCalendardateSelection = useCallback(endDate => {
    setSelectedRange({ preset: 'custom', endDate: endOfDay(endDate)});
  }, [setSelectedRange]);

  if (isCalendar) {
    return (
      <Calendar
        {...props}
        date={ranges[0].endDate} // ranges[0].endate consists the selected date
        onChange={handleCalendardateSelection}
        months={1}
     />
    );
  }

  return (
    <DateRangePicker
      {...props}
      onChange={handleDateRangeSelection}
      months={2}
  />
  );
};

export default function DateRangeSelector({
  value = {},
  onSave,
  fromDate,
  classProps = {},
  customPresets = [],
  showTime = true,
  clearable = false,
  clearValue,
  placement,
  Icon,
  disabled,
  fullWidthBtn,
  placeholder = 'Select range',
  defaultPreset = {preset: 'last30days'},
  selectedRangeConstraint,
  CustomTextFields,
  toDate,
  // default Date display to be shown in all cases
  showDateDisplay = true,
  isCalendar,
}) {
  const defaultValue = getSelectedRange(defaultPreset);
  const { startDate = defaultValue.startDate, endDate = defaultValue.endDate, preset = defaultValue.preset } = value;
  const [initalValue, setInitialValue] = useState(
    {
      startDate,
      endDate,
      preset,
    },
  );
  const [reset, setReset] = useState(false);

  const [selectedRange, setSelectedRange] = useState(initalValue);

  const setSelectedRangeWithConstraint = useCallback(selected => {
    const {startDate, endDate} = selected;

    if (selectedRangeConstraint && !selectedRangeConstraint(startDate, endDate)) { return; }
    setSelectedRange(selected);
    setReset(state => !state);
  }, [selectedRangeConstraint]);
  const handleListItemClick = (event, id) => {
    setSelectedRangeWithConstraint(state => ({...state, preset: id}));
  };
  const [anchorEl, setAnchorEl] = useState(null);
  const classes = useStyles();
  const presets = useMemo(() => customPresets.length ? customPresets : defaultPresets, [customPresets]);
  const toggleClick = useCallback(event => {
    if (anchorEl) {
      setSelectedRangeWithConstraint(initalValue);
    }
    setAnchorEl(state => (state ? null : event.currentTarget));
  }, [anchorEl, setSelectedRangeWithConstraint, initalValue]);

  const handleSave = useCallback(() => {
    if (selectedRange.preset === 'lastrun') {
      const lastRunPreset = customPresets.find(preset => preset.label === 'Last run')?.range();

      selectedRange.startDate = lastRunPreset.startDate;
      selectedRange.endDate = lastRunPreset.endDate;
    }
    setInitialValue(selectedRange);
    onSave && onSave(selectedRange);

    setAnchorEl(null);
  }, [customPresets, onSave, selectedRange]);

  const handleClose = useCallback(() => {
    setSelectedRangeWithConstraint(initalValue);
    setAnchorEl(null);
  }, [initalValue, setSelectedRangeWithConstraint]);

  const handleClear = useCallback(() => {
    setSelectedRangeWithConstraint(() => {
      const clearRangeValue = clearValue || {startDate: null, endDate: null, preset: null};

      onSave && onSave(clearRangeValue);

      return clearRangeValue;
    });
    setAnchorEl(null);
  }, [setSelectedRangeWithConstraint, clearValue, onSave]);

  return (
    <>
      {
        Icon ? (
          <ActionButton disabled={!!disabled} onClick={toggleClick}>
            <Icon />
          </ActionButton>
        ) : (
          <OutlinedButton
            color="secondary"
            disabled={!!disabled}
            onClick={toggleClick}
            className={clsx(classes.dateRangePopperBtn, {[classes.dateRangePopperBtnFull]: fullWidthBtn})}>
            {presets.find(preset => preset.id === selectedRange.preset)?.label || selectedRange.preset || placeholder}<ArrowDownIcon />
          </OutlinedButton>
        )
      }
      <ArrowPopper
        open={!!anchorEl}
        anchorEl={anchorEl}
        classes={{
          popper: clsx(classProps.filterTimeStampPopper, {[classProps.filterTimeStampPopperExpand]: selectedRange.preset === 'custom' }),
          arrow: clsx(classProps.filterTimeStampPopperArrow, {[classProps.filterTimeStampArrowPopperExpand]: selectedRange.preset === 'custom'}),
        }}
        restrictToParent={false}
        placement={placement || 'bottom-end'}
        onClose={toggleClick}>
        {anchorEl && (
          <div className={classes.dateRangePickerWrapper}>
            <div className={classes.parentPicker}>
              <div className={classes.leftItems}>
                <List className={classes.leftItemsList}>
                  {presets.map((m, i) => (
                    <div key={m.id}>
                      {!!i}
                      <ListItem
                        button
                        className={classes.listBtn}
                        selected={selectedRange.preset === m.id}
                        onClick={event => handleListItemClick(event, m.id)}
                      >
                        <ListItemText secondary={m.label} />
                      </ListItem>
                    </div>
                  ))}

                </List>
                {selectedRange.preset === 'custom' &&
                CustomTextFields && (
                <CustomTextFields
                  reset={reset}
                  setReset={setReset} selectedRange={selectedRange}
                  setSelectedRange={setSelectedRange} />
                )}
              </div>
              {selectedRange.preset === 'custom' && (
              <div className={classes.rightCalendar}>
                <DateRange
                  isCalendar={isCalendar}
                  setSelectedRange={setSelectedRangeWithConstraint}
                  staticRanges={[]}
                  showSelectionPreview
                  showDateDisplay={showDateDisplay}
                  moveRangeOnFirstSelection={false}
                  showMonthAndYearPickers={false}
                  editableDateInputs={false}
                  className={classes.child}
                  ranges={[{...selectedRange, key: 'selection'}]}
                  direction="horizontal"
                  showTime={showTime}
                  maxDate={toDate || new Date()}
                  minDate={fromDate || addYears(new Date(), -1)}
                  inputRanges={[]}
                  showPreview={false}
                />
              </div>
              )}
            </div>
            <div className={classes.actions}>
              <ActionGroup>
                <FilledButton onClick={handleSave}>
                  Apply
                </FilledButton>
                {clearable && (
                <TextButton onClick={handleClear}>
                  Clear
                </TextButton>
                )}
                <TextButton onClick={handleClose}>
                  Cancel
                </TextButton>
              </ActionGroup>
            </div>
          </div>
        )}
      </ArrowPopper>
    </>
  );
}
