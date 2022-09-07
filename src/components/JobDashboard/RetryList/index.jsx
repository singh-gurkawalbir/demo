import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectors } from '../../../reducers';
import actions from '../../../actions';
import ResourceTable from '../../ResourceTable';
import { isNewId } from '../../../utils/resource';
import RetryTableFilters from './RetryTableFilters';
import Spinner from '../../Spinner';
import NoResultTypography from '../../NoResultTypography';

export default function RetryList({ flowId, resourceId }) {
  const filterKey = 'retryJobs';
  const dispatch = useDispatch();

  const filters = useSelector(state => selectors.filter(state, filterKey));
  const retries = useSelector(state => selectors.retryList(state, resourceId, filters));
  const retryListStatus = useSelector(state => selectors.retryListStatus(state, resourceId));

  const clearFilter = useCallback(() => {
    dispatch(actions.clearFilter(filterKey));
  }, [dispatch]);

  useEffect(
    () => () => {
      clearFilter();
    },
    [clearFilter]
  );

  useEffect(() => {
    if (flowId && !isNewId(flowId)) {
      dispatch(
        actions.errorManager.retries.request({
          flowId,
          resourceId,
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, flowId]);

  return (
    <>
      <RetryTableFilters flowId={flowId} resourceId={resourceId} />
      {retryListStatus === 'requested' ? (
        <Spinner centerAll />
      ) : (
        <div>
          <ResourceTable resources={retries} resourceType="retries" />
          {!retries.length && (
          <div>
            <NoResultTypography>You don’t have any retries.</NoResultTypography>
            <NoResultTypography>Errors can be retried from the Open errors and Resolved errors tabs.</NoResultTypography>
          </div>
          )}
        </div>
      )}
    </>
  );
}
