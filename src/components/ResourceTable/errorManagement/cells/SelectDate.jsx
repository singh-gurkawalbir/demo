import React, { useCallback, useMemo } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { addDays, startOfDay } from 'date-fns';
import actions from '../../../../actions';
import { selectors } from '../../../../reducers';
import DateRangeSelector from '../../../DateRangeSelector';
import ErrorFilterIcon from '../ErrorFilterIcon';
import { FILTER_KEYS } from '../../../../utils/errorManagement';
import { getSelectedRange } from '../../../../utils/flowMetrics';

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

  const rangeFilters = [
    {id: 'today', label: 'Today'},
    {id: 'yesterday', label: 'Yesterday'},
    {id: 'last24hours', label: 'Last 24 hours'},
    {id: 'last7days', label: 'Last 7 Days'},
    {id: 'last15days', label: 'Last 15 Days'},
    {id: 'last30days', label: 'Last 30 Days'},
    {id: 'custom', label: 'Custom'},
  ];

  return (
    <div> {title}
      <DateRangeSelector
        clearable
        clearValue={defaultRange}
        onSave={handleDateFilter}
        Icon={FilterIcon}
        value={selectedDate}
        customPresets={rangeFilters}
        fromDate={startOfDay(addDays(new Date(), -29))}
        showTime={false}
         />
    </div>
  );
}
