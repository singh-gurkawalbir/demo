import React, { useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import actions from '../../../../actions';
import { FILTER_KEYS, ERROR_MANAGEMENT_RANGE_FILTERS } from '../../../../utils/errorManagement';
import DateFilter from '../../commonCells/DateFilter';

export default function SelectSource({flowId, resourceId, isResolved, title, filterBy, flowJobId}) {
  const dispatch = useDispatch();

  const handleChange = useCallback(
    () => {
      dispatch(
        actions.errorManager.flowErrorDetails.request({
          flowId,
          flowJobId,
          resourceId,
          isResolved,
        })
      );
    },
    [dispatch, flowId, flowJobId, isResolved, resourceId],
  );
  const filterKey = isResolved ? FILTER_KEYS.RESOLVED : FILTER_KEYS.OPEN;

  return (
    useMemo(() => (
      <DateFilter
        title={title}
        filterBy={filterBy}
        filterKey={filterKey}
        handleChange={handleChange}
        showTime
        customPresets={ERROR_MANAGEMENT_RANGE_FILTERS} />
    ),
    [filterBy, filterKey, handleChange, title])
  );
}
