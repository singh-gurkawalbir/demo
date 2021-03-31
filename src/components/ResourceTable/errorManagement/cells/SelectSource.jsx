import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectors } from '../../../../reducers';
import MultiSelectColumnFilter from '../../commonCells/MultiSelectColumnFilter';
import actions from '../../../../actions';
import { FILTER_KEYS } from '../../../../utils/errorManagement';

export default function SelectSource({ flowId, resourceId, isResolved }) {
  const dispatch = useDispatch();
  const sourceOptions = useSelector(state => selectors.sourceOptions(state, resourceId));

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
    <MultiSelectColumnFilter
      filterKey={filterKey}
      handleSave={handleSave}
      options={sourceOptions} />
  );
}
