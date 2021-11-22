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
import {FILTER_KEYS_AD} from '../../../../utils/accountDashboard';

const useStyles = makeStyles(theme => ({
  jobTable: {
    height: '100%',
    overflow: 'auto',
  },
  emptyMessage: {
    margin: theme.spacing(3, 2),
  },
  root: {
    backgroundColor: theme.palette.common.white,
    overflow: 'auto',
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

  integrationId = childId ? `store${childId}pid${integrationId}` : integrationId;
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
            <span data-public>
              <Filters
                filterKey={filterKey} />
            </span>
            <ResourceTable
              resources={jobs}
              className={classes.jobTable}
              resourceType={filterKey}
          />
          </>
        )}
      </div>
      {!jobs?.length && !isRunningJobsCollectionLoading ? <Typography variant="body2" className={classes.emptyMessage}>You don&apos;t have any running flows. </Typography> : ''}
    </>
  );
}
