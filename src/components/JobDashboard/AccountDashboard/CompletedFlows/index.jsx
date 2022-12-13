import React, { Fragment } from 'react';
import { makeStyles } from '@material-ui/core';
import { useSelector } from 'react-redux';
import clsx from 'clsx';
import { selectors } from '../../../../reducers';
import Filters from '../Filters';
import ResourceTable from '../../../ResourceTable';
import Spinner from '../../../Spinner';
import RunHistoryDrawer from '../../RunHistoryDrawer';
import ErrorsListDrawer from '../../../../views/Integration/common/ErrorsList';
import {FILTER_KEYS_AD} from '../../../../utils/accountDashboard';
import NoResultTypography from '../../../NoResultTypography';

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
  root: {
    backgroundColor: theme.palette.background.paper,
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
  },
  scrollTable: {
    overflow: 'auto',
    paddingBottom: theme.spacing(4),
  },
  completeFlowTable: {
    minHeight: '300px',
  },
  noResultCompletedFlows: {
    paddingLeft: 0,
  },
}));
const filterKey = FILTER_KEYS_AD.COMPLETED;

export default function CompletedFlows() {
  const classes = useStyles();

  const jobs = useSelector(state => selectors.accountDashboardCompletedJobs(state));
  const isCompletedJobsCollectionLoading = useSelector(state => selectors.isCompletedJobsCollectionLoading(state));

  const showEmptyMessage = !jobs?.length && !isCompletedJobsCollectionLoading;

  return (
    <div className={!showEmptyMessage && classes.completeFlowTable}>
      <div className={classes.root}>
        {isCompletedJobsCollectionLoading ? (<Spinner loading size="large" />) : (
          <>
            <Filters
              filterKey={filterKey}
              />
            <ResourceTable
              resources={jobs}
              className={clsx(classes.jobTable, !showEmptyMessage && classes.scrollTable)}
              resourceType={filterKey}
              size="small"
          />
          </>
        )}
      </div>
      {showEmptyMessage ? <NoResultTypography className={classes.noResultCompletedFlows}>You don&apos;t have any completed flows in the selected date range. </NoResultTypography> : ''}
      <RunHistoryDrawer />
      <ErrorsListDrawer />
    </div>
  );
}
