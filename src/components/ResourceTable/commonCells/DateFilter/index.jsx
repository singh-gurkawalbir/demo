import React, { useCallback, useMemo } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
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
}) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const filter = useSelector(state => selectors.filter(state, filterKey), shallowEqual);
  const isDateFilterSelected = !!(filter[filterBy] && filter[filterBy].preset !== defaultRange.preset);

  const handleDateFilter = useCallback(
    dateFilter => {
      const selectedRange = getSelectedRange(dateFilter);

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
    [dispatch, filter, filterBy, filterKey, handleChange],
  );
  const FilterIcon = () => <FilterIconWrapper selected={isDateFilterSelected} />;

  const selectedDate = useMemo(() => isDateFilterSelected ? {
    startDate: new Date(filter[filterBy].startDate),
    endDate: new Date(filter[filterBy].endDate),
    preset: filter[filterBy].preset,
  } : defaultRange, [isDateFilterSelected, filter, filterBy, defaultRange]);

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
        showTime={showTime}
         />
    </div>
  );
}
