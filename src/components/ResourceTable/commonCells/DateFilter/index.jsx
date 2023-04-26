import React, { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import makeStyles from '@mui/styles/makeStyles';
import { addDays, startOfDay } from 'date-fns';
import actions from '../../../../actions';
import { selectors } from '../../../../reducers';
import DateRangeSelector from '../../../DateRangeSelector';
import FilterIconWrapper from '../FilterIconWrapper';
import { getSelectedRange } from '../../../../utils/flowMetrics';

const useStyles = makeStyles({
  filterTimeStampPopper: {
    left: '110px !important',
    top: '5px !important',
  },
  filterTimeStampPopperArrow: {
    left: '340px !important',
  },
  filterTimeStampPopperExpand: {
    left: '0% !important',
  },
  filterTimeStampArrowPopperExpand: {
    left: '98% !important',
  },
  dateFilterWrapper: {
    display: 'flex',
    alignItems: 'flex-start',
    whiteSpace: 'nowrap',
  },

});
const DEFAULT_RANGE = {
  startDate: startOfDay(addDays(new Date(), -29)),
  endDate: new Date(),
  preset: 'last30days',
};

export default function SelectDate({
  title = 'Timestamp',
  filterBy = 'occuredAt',
  filterKey,
  handleChange,
  customPresets,
  showTime = false,
  defaultRange = DEFAULT_RANGE,
  skipLastEndDate = false,
  fromDate,
}) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const filter = useSelector(state => selectors.filter(state, filterKey));
  const isDateFilterSelected = !!(filter[filterBy] && filter[filterBy].preset !== defaultRange.preset);

  const handleDateFilter = useCallback(
    dateFilter => {
      const selectedRange = getSelectedRange(dateFilter, skipLastEndDate);

      dispatch(
        actions.patchFilter(filterKey, {
          [filterBy]: selectedRange,
          paging: {
            ...filter.paging,
            currPage: 0,
          },
        })
      );
      handleChange?.();
    },
    [dispatch, filter, filterBy, filterKey, handleChange, skipLastEndDate],
  );
  const FilterIcon = () => <FilterIconWrapper selected={isDateFilterSelected} />;

  const selectedDate = useMemo(() => isDateFilterSelected ? {
    startDate: new Date(filter[filterBy].startDate),
    // when end date can be null in the filter, we should get the correct endDate to pass to DateRange module
    endDate: !skipLastEndDate
      ? new Date(filter[filterBy].endDate)
      : new Date(filter[filterBy].endDate || getSelectedRange(filter[filterBy]).endDate),
    preset: filter[filterBy].preset,
  } : defaultRange, [skipLastEndDate, isDateFilterSelected, filter, filterBy, defaultRange]);

  return (
    <div className={classes.dateFilterWrapper}> {title}
      <DateRangeSelector
        clearable
        classProps={classes}
        clearValue={defaultRange}
        onSave={handleDateFilter}
        Icon={FilterIcon}
        value={selectedDate}
        customPresets={customPresets}
        showCustomRangeValue
        showTime={showTime}
        fromDate={fromDate}
         />
    </div>
  );
}
