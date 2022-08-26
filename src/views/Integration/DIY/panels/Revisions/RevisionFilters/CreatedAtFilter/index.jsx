import React, { useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import { getRevisionFilterKey, DEFAULT_REVISION_FILTERS } from '../../../../../../../utils/revisions';
import { selectors } from '../../../../../../../reducers';
import actions from '../../../../../../../actions';
import DateRangeSelector from '../../../../../../../components/DateRangeSelector';
import { getSelectedRange } from '../../../../../../../utils/flowMetrics';

export default function RevisionFilters() {
  const { integrationId } = useParams();
  const dispatch = useDispatch();
  const filterKey = getRevisionFilterKey(integrationId);
  const revisionsPagingFilter = useSelector(state =>
    selectors.filter(state, filterKey)?.paging,
  shallowEqual);
  const selectedCreatedAt = useSelector(state => {
    const revisionFilter = selectors.filter(state, filterKey);

    return revisionFilter?.createdAt;
  });

  const handleDateFilter = useCallback(
    dateFilter => {
      const selectedRange = getSelectedRange(dateFilter, true);

      dispatch(
        actions.patchFilter(filterKey, {
          createdAt: selectedRange,
          paging: {
            ...revisionsPagingFilter,
            currPage: 0,
          },
        })
      );
    },
    [dispatch, filterKey, revisionsPagingFilter],
  );

  return (
    <DateRangeSelector
      clearable
      placement="right"
      placeholder="Select date created"
      clearValue={DEFAULT_REVISION_FILTERS.createdAt}
      onSave={handleDateFilter}
      value={selectedCreatedAt}
      showCustomRangeValue
    />
  );
}
