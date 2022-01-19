import React, { useEffect, Fragment } from 'react';
import { makeStyles, Typography } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import {useRouteMatch} from 'react-router-dom';
import { selectors } from '../../../../reducers';
import actions from '../../../../actions';
import Filters from '../Filters';
import ResourceTable from '../../../ResourceTable';
import { hashCode } from '../../../../utils/string';
import Spinner from '../../../Spinner';
import {FILTER_KEYS_AD, getDashboardIntegrationId} from '../../../../utils/accountDashboard';

const useStyles = makeStyles(theme => ({
  emptyMessage: {
    marginTop: theme.spacing(2),
    padding: theme.spacing(0, 2, 2),
  },
  root: {
    backgroundColor: theme.palette.common.white,
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
  },
}));
const filterKey = FILTER_KEYS_AD.RUNNING;

export default function RunningFlows() {
  const classes = useStyles();

  const dispatch = useDispatch();

  const match = useRouteMatch();
  let { integrationId } = match.params;
  const { childId } = match.params;

  integrationId = getDashboardIntegrationId(integrationId, childId);
  const integrationFilterKey = `${integrationId || ''}${filterKey}`;

  const filters = useSelector(state => selectors.filter(state, integrationFilterKey));

  const { paging, sort, ...nonPagingFilters } = filters || {};

  const filterHash = hashCode(nonPagingFilters);

  const jobs = useSelector(state => selectors.accountDashboardRunningJobs(state));
  const isRunningJobsCollectionLoading = useSelector(state => selectors.isRunningJobsCollectionLoading(state));

  useEffect(
    () => () => {
      dispatch(actions.job.dashboard.running.clear());
    },
    [dispatch]
  );
  useEffect(() => {
    dispatch(actions.job.dashboard.running.requestInProgressJobStatus());
  }, [dispatch]);

  useEffect(() => {
    dispatch(
      actions.job.dashboard.running.requestCollection({ integrationId})
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, filterHash, integrationId]);

  return (
    <>
      <div className={classes.root}>
        {isRunningJobsCollectionLoading ? (<Spinner centerAll />) : (
          <>
            <Filters
              filterKey={filterKey} />
            <ResourceTable
              resources={jobs}
              resourceType={filterKey}
          />
          </>
        )}
      </div>
      {!jobs?.length && !isRunningJobsCollectionLoading ? <Typography variant="body2" className={classes.emptyMessage}>You don&apos;t have any running flows. </Typography> : ''}
    </>
  );
}
