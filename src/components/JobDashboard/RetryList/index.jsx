import React, { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouteMatch } from 'react-router-dom';
import { makeStyles } from '@material-ui/core';
import { selectors } from '../../../reducers';
import actions from '../../../actions';
import ResourceTable from '../../ResourceTable';
import { isNewId } from '../../../utils/resource';
import RetryTableFilters from './RetryTableFilters';
import Spinner from '../../Spinner';
import NoResultTypography from '../../NoResultTypography';
import { DEFAULT_FILTERS, FILTER_KEYS } from '../../../utils/errorManagement';

const useStyles = makeStyles(() => ({
  retriesList: {
    maxHeight: 'calc(100vh - 320px)',
    overflow: 'auto',
  },
}));

export default function RetryList({ flowId }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const match = useRouteMatch();
  const { resourceId } = match.params;

  const filters = useSelector(state => selectors.filter(state, FILTER_KEYS.RETRIES));
  const retries = useSelector(state => selectors.retryList(state, flowId, resourceId, filters));
  const retryListStatus = useSelector(state => selectors.retryListStatus(state, flowId, resourceId));
  const integrationId = useSelector(state =>
    selectors.resource(state, 'flows', flowId)?._integrationId || 'none'
  );
  const isIntegrationUsersRequested = useSelector(state =>
    !!selectors.integrationUsers(state, integrationId)
  );

  const actionProps = useMemo(() => ({
    resourceId,
    flowId,
  }), [flowId, resourceId]);

  useEffect(() => {
    dispatch(actions.patchFilter(FILTER_KEYS.RETRIES, DEFAULT_FILTERS.RETRIES));
  }, [dispatch]);

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

  const requestIntegrationUsers = useCallback(() => {
    if (!isIntegrationUsersRequested) {
      dispatch(actions.resource.requestCollection(`integrations/${integrationId}/ashares`));
    }
  }, [dispatch, integrationId, isIntegrationUsersRequested]);

  useEffect(() => {
    requestIntegrationUsers();
  }, [requestIntegrationUsers]);

  return (
    <>
      <RetryTableFilters flowId={flowId} resourceId={resourceId} filterKey={FILTER_KEYS.RETRIES} />
      {retryListStatus === 'requested' ? (
        <Spinner centerAll />
      ) : (
        <div className={classes.retriesList}>
          <ResourceTable
            resources={retries}
            filterKey={FILTER_KEYS.RETRIES}
            resourceType="retries"
            actionProps={actionProps} />
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
