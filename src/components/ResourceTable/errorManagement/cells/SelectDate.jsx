import React, { useCallback, useMemo } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { addDays, startOfDay } from 'date-fns';
import actions from '../../../../actions';
import { selectors } from '../../../../reducers';
import DateRangeSelector from '../../../DateRangeSelector';
import ErrorFilterIcon from '../ErrorFilterIcon';
import { FILTER_KEYS } from '../../../../utils/errorManagement';

const defaultRange = {
  startDate: startOfDay(addDays(new Date(), -29)).toISOString(),
  endDate: new Date().toISOString(),
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
  const isDateFilterSelected = !!filter[filterBy];

  const handleDateFilter = useCallback(
    dateFilter => {
      dispatch(
        actions.patchFilter(filterKey, {
          ...filter,
          [filterBy]: dateFilter,
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

  const selectedDate = useMemo(() => {
    const defaultFilter = {
      startDate: new Date(defaultRange.startDate),
      endDate: new Date(defaultRange.endDate),
      preset: defaultRange.preset,
    };

    return isDateFilterSelected ? {
      startDate: new Date(filter[filterBy].startDate),
      endDate: new Date(filter[filterBy].endDate),
      preset: filter[filterBy].preset,
    } : defaultFilter;
  }, [isDateFilterSelected, filter, filterBy]);

  return (
    <div> {title}
      <DateRangeSelector
        onSave={handleDateFilter}
        Icon={FilterIcon}
        value={selectedDate} />
    </div>
  );
}
