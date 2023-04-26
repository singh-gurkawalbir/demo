import React, { useEffect, Fragment } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { useSelector, useDispatch } from 'react-redux';
import {useRouteMatch} from 'react-router-dom';
import { Spinner } from '@celigo/fuse-ui';
import { selectors } from '../../../../reducers';
import actions from '../../../../actions';
import Filters from '../Filters';
import ResourceTable from '../../../ResourceTable';
import { hashCode } from '../../../../utils/string';
import {FILTER_KEYS_AD, getDashboardIntegrationId} from '../../../../utils/accountDashboard';
import NoResultTypography from '../../../NoResultTypography';
import messageStore from '../../../../utils/messageStore';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
  },
  noResultRunningFlows: {
    paddingLeft: 0,
  },
}));
const filterKey = FILTER_KEYS_AD.RUNNING;

export default function RunningFlows() {
  const classes = useStyles();

  const dispatch = useDispatch();

  const match = useRouteMatch();
  let { integrationId } = match.params;
  const { childId } = match.params;
  const isIntegrationAppV1 = useSelector(state => selectors.isIntegrationAppV1(state, integrationId));

  integrationId = getDashboardIntegrationId(integrationId, childId, isIntegrationAppV1);
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
        {isRunningJobsCollectionLoading ? (
          <Spinner center="horizontal" size="large" />
        ) : (
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
      {!jobs?.length && !isRunningJobsCollectionLoading ? <NoResultTypography className={classes.noResultRunningFlows}>{messageStore('NO_RESULT', {message: 'running flows'})} </NoResultTypography> : ''}
    </>
  );
}
