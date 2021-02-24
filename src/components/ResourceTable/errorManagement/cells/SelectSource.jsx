import React, { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import actions from '../../../../actions';
import { selectors } from '../../../../reducers';
import SourceFilter from '../SourceFilter';
import { FILTER_KEYS } from '../../../../utils/errorManagement';

export default function SelectSource({
  flowId,
  resourceId,
  isResolved,
}) {
  const dispatch = useDispatch();
  const filterKey = isResolved ? FILTER_KEYS.RESOLVED : FILTER_KEYS.OPEN;

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
          paging: {
            ...filter.paging,
            currPage: 0,
          },
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
      <SourceFilter
        onSave={handleSave}
        selectedSources={filter.sources}
        resourceId={resourceId}
      />
    </div>
  );
}
