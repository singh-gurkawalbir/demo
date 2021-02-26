import React, { useCallback, useMemo } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { addDays, startOfDay } from 'date-fns';
import actions from '../../../../actions';
import { selectors } from '../../../../reducers';
import DateRangeSelector from '../../../DateRangeSelector';
import ErrorFilterIcon from '../ErrorFilterIcon';
import { FILTER_KEYS, ERROR_MANAGEMENT_RANGE_FILTERS } from '../../../../utils/errorManagement';
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

});
const defaultRange = {
  startDate: startOfDay(addDays(new Date(), -29)),
  endDate: new Date(),
  preset: 'last30days',
};

export default function SelectDate({
  flowId,
  resourceId,
  isResolved,
  title = 'Timestamp',
  filterBy = 'occuredAt',
}) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const filterKey = isResolved ? FILTER_KEYS.RESOLVED : FILTER_KEYS.OPEN;
  const filter = useSelector(state =>
    selectors.filter(state, filterKey),
  shallowEqual
  );
  const isDateFilterSelected = !!(filter[filterBy] && filter[filterBy].preset !== defaultRange.preset);

  const handleDateFilter = useCallback(
    dateFilter => {
      const selectedRange = getSelectedRange(dateFilter);

      dispatch(
        actions.patchFilter(filterKey, {
          ...filter,
          [filterBy]: selectedRange,
        })
      );
      dispatch(
        actions.errorManager.flowErrorDetails.request({
          flowId,
          resourceId,
          isResolved,
        })
      );
    },
    [dispatch, flowId, resourceId, isResolved, filterKey, filterBy, filter],
  );
  const FilterIcon = () => <ErrorFilterIcon selected={isDateFilterSelected} />;

  const selectedDate = useMemo(() => isDateFilterSelected ? {
    startDate: new Date(filter[filterBy].startDate),
    endDate: new Date(filter[filterBy].endDate),
    preset: filter[filterBy].preset,
  } : defaultRange, [isDateFilterSelected, filter, filterBy]);

  return (
    <div> {title}
      <DateRangeSelector
        clearable
        classProps={classes}
        clearValue={defaultRange}
        onSave={handleDateFilter}
        Icon={FilterIcon}
        value={selectedDate}
        customPresets={ERROR_MANAGEMENT_RANGE_FILTERS}
        showTime={false}
         />
    </div>
  );
}
