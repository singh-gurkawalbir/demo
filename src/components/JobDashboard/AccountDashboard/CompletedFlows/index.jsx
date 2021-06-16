import React, { useEffect, useCallback } from 'react';
import { makeStyles } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';

import LoadResources from '../../../LoadResources';
import { selectors } from '../../../../reducers';
import actions from '../../../../actions';
import Filters from '../Filters';
import JobTable from './JobTable';
import { hashCode } from '../../../../utils/string';

const useStyles = makeStyles(({
  jobTable: {
    height: '100%',
    overflow: 'auto',
    paddingBottom: 115,
  },
}));
export default function RunningFlows({
  integrationId,
  rowsPerPage = 100,
}) {
  const filterKey = 'runningflows';
  const classes = useStyles();

  const dispatch = useDispatch();
  const userPermissionsOnIntegration = useSelector(state =>
    selectors.resourcePermissions(state, 'integrations', integrationId)
  );

  const filters = useSelector(state => selectors.filter(state, filterKey));
  const jobs = useSelector(state => selectors.accountDashboardCompletedJobs(state));

  const clearFilter = useCallback(() => {
    dispatch(actions.clearFilter(filterKey));
  }, [dispatch]);
  const { currentPage = 0, ...nonPagingFilters } = filters;
  const filterHash = hashCode(nonPagingFilters);

  useEffect(
    () => () => {
      dispatch(actions.job.clear());
    },
    [dispatch, filterHash]
  );

  useEffect(
    () => () => {
      clearFilter();
    },
    [clearFilter]
  );

  /** Whenever page changes, we need to update the same in state and
   * request for in-progress jobs (in current page) status */
  useEffect(() => {
    dispatch(actions.job.paging.setCurrentPage(currentPage));
    dispatch(actions.job.requestInProgressJobStatus());
  }, [dispatch, currentPage]);

  useEffect(() => {
    dispatch(actions.job.paging.setRowsPerPage(rowsPerPage));
  }, [dispatch, rowsPerPage]);
  useEffect(() => {
    dispatch(
      actions.job.dashboard.completed.requestCollection({
        integrationId,
        filters,
        options: { },
      })
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, integrationId, filterHash]);

  return (
    <LoadResources required resources="integrations,flows,exports,imports">
      <span data-public>
        <Filters
          filterKey={filterKey}
      />
      </span>
      <JobTable
        classes={classes.jobTable}
        jobsInCurrentPage={jobs}
        userPermissionsOnIntegration={userPermissionsOnIntegration}
      />
    </LoadResources>
  );
}
