import React, { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import actions from '../../../../actions';
import { selectors } from '../../../../reducers';
import SourceFilter from '../SourceFilter';

export default function SelectSource({
  flowId,
  resourceId,
  isResolved,
  filterKey,
}) {
  const dispatch = useDispatch();
  const filter = useSelector(state =>
    selectors.filter(state, filterKey),
  shallowEqual
  );
  const handleSave = useCallback(
    sourceIds => {
      dispatch(
        actions.patchFilter(filterKey, {
          ...filter,
          sources: sourceIds,
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
    [dispatch, filter, filterKey, flowId, isResolved, resourceId],
  );

  return (
    <div> Source
      <SourceFilter onSave={handleSave} selectedSources={filter.sources} />
    </div>
  );
}
