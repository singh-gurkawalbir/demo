import React, { useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';
// import { selectors } from '../../../reducers';
import MultiSelectColumnFilter from '../../ResourceTable/commonCells/MultiSelectColumnFilter';
import actions from '../../../actions';
import { FILTER_KEYS } from '../../../utils/errorManagement';

export default function SelectFlow({ flowId, resourceId, isResolved }) {
  const dispatch = useDispatch();
  const sourceOptions = [{ _id: 'all', name: 'All sources'}, { _id: 'a1', name: 'A1'}, { _id: 'a2', name: 'A2'}, { _id: 'a3', name: 'A3'}];

  const handleSave = useCallback(
    () => {
      dispatch(
        actions.errorManager.flowErrorDetails.request({
          flowId,
          resourceId,
          isResolved,
        })
      );
    },
    [dispatch, flowId, isResolved, resourceId],
  );
  const filterKey = isResolved ? FILTER_KEYS.RESOLVED : FILTER_KEYS.OPEN;

  return (
    useMemo(() => (
      <MultiSelectColumnFilter
        title="Flow"
        filterKey={filterKey}
        handleSave={handleSave}
        options={sourceOptions} />
    ),
    [filterKey, handleSave, sourceOptions])
  );
}
