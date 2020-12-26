import React, { useCallback } from 'react';
// import { useDispatch } from 'react-redux';
import { addDays, startOfDay } from 'date-fns';
// import actions from '../../../../actions';
// import { selectors } from '../../../../reducers';
// import ActionButton from '../../../ActionButton';
// import { getSelectedRange } from '../../../../utils/flowMetrics';
import DateRangeSelector from '../../../DateRangeSelector';
import ErrorFilterIcon from '../ErrorFilterIcon';

const defaultRange = {
  startDate: startOfDay(addDays(new Date(), -29)).toISOString(),
  endDate: new Date().toISOString(),
  preset: 'last30days',
};

// eslint-disable-next-line no-empty-pattern
export default function SelectAllErrors({
  // flowId,
  // resourceId,
  // isResolved,
  // filterKey,
  // defaultFilter,
  // actionInProgress,
  title = 'Timestamp',
}) {
  // const dispatch = useDispatch();
  const handleDateFilter = useCallback(
    () => {
      // console.log(dateFilter);
    },
    [],
  );
  const FilterIcon = () => <ErrorFilterIcon />;

  return (
    <div> {title}
      <DateRangeSelector
        onSave={handleDateFilter}
        Icon={FilterIcon}
        value={{
          startDate: new Date(defaultRange.startDate),
          endDate: new Date(defaultRange.endDate),
          preset: defaultRange.preset,
        }} />
    </div>
  );
}
