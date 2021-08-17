import React, { useEffect, Fragment } from 'react';
import { makeStyles, Typography } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import clsx from 'clsx';
import { selectors } from '../../../../reducers';
import actions from '../../../../actions';
import Filters from '../Filters';
import ResourceTable from '../../../ResourceTable';
import { hashCode } from '../../../../utils/string';
import Spinner from '../../../Spinner';
import RunHistoryDrawer from '../../RunHistoryDrawer';
import ErrorsListDrawer from '../../../../views/Integration/common/ErrorsList';
import {FILTER_KEYS_AD} from '../../../../utils/accountDashboard';

const useStyles = makeStyles(theme => ({
  jobTable: {
    height: '100%',
    '& td:last-child': {
      minWidth: 'initial',
    },
    '& .MuiTableCell-sizeSmall': {
      padding: theme.spacing(1),
    },
    '& .MuiTableCell-root:first-child': {
      paddingLeft: theme.spacing(2),
    },
  },
  emptyMessage: {
    margin: theme.spacing(3, 2),
  },
  root: {
    backgroundColor: theme.palette.common.white,
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
  },
  scrollTable: {
    overflow: 'auto',
  },
  completeFlowTable: {
    minHeight: '300px',
  },
}));
const filterKey = FILTER_KEYS_AD.COMPLETED;

export default function CompletedFlows() {
  const classes = useStyles();

  const dispatch = useDispatch();

  const filters = useSelector(state => selectors.filter(state, filterKey));
  const { paging, sort, ...nonPagingFilters } = filters;
  const filterHash = hashCode(nonPagingFilters);

  const jobs = useSelector(state => selectors.accountDashboardCompletedJobs(state));
  const isCompletedJobsCollectionLoading = useSelector(state => selectors.isCompletedJobsCollectionLoading(state));

  useEffect(
    () => () => {
      dispatch(actions.job.dashboard.completed.clear());
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dispatch]
  );

  useEffect(() => {
    dispatch(
      actions.job.dashboard.completed.requestCollection()
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, filterHash]);

  const showEmptyMessage = !jobs?.length && !isCompletedJobsCollectionLoading;

  return (
    <div className={!showEmptyMessage && classes.completeFlowTable}>
      <div className={classes.root}>
        {isCompletedJobsCollectionLoading ? (<Spinner centerAll />) : (
          <>
            <span data-public>
              <Filters
                filterKey={filterKey}
              />
            </span>
            <ResourceTable
              resources={jobs}
              className={clsx(classes.jobTable, !showEmptyMessage && classes.scrollTable)}
              resourceType={filterKey}
              size="small"
          />
          </>
        )}
      </div>
      {showEmptyMessage ? <Typography variant="body2" className={classes.emptyMessage}>You don&apos;t have any completed flows in the selected date range. </Typography> : ''}
      <RunHistoryDrawer />
      <ErrorsListDrawer />
    </div>
  );
}
