import React, { useMemo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  makeStyles, Typography,
} from '@material-ui/core';
import { addDays, startOfDay } from 'date-fns';
import { selectors } from '../../../../reducers';
import actions from '../../../../actions';
import RefreshIcon from '../../../icons/RefreshIcon';
import IconTextButton from '../../../IconTextButton';
import CeligoPagination from '../../../CeligoPagination';
import DateRangeSelector from '../../../DateRangeSelector';
import { FILTER_KEYS_AD, ACCOUNT_DASHBOARD_COMPLETED_JOBS_RANGE_FILTERS, DEFAULTS_COMPLETED_JOBS_FILTER, DEFAULTS_RUNNING_JOBS_FILTER } from '../../../../utils/accountDashboard';
import { getSelectedRange } from '../../../../utils/flowMetrics';

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: -1,
    paddingBottom: theme.spacing(1.5),
    backgroundColor: theme.palette.common.white,
    overflowX: 'auto',
  },
  tablePaginationRoot: {
    display: 'flex',
  },
  rangeFilter: {
    display: 'flex',
    alignItems: 'center',
    '& .MuiTypography-root': {
      marginRight: theme.spacing(1),
    },
  },
  filterContainer: {
    padding: theme.spacing(2, 0, 2, 2),
    border: `solid 1px ${theme.palette.secondary.lightest}`,
    borderWidth: [[1, 0]],
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    minWidth: '1200px',
    '& > *': {
      marginRight: 10,
    },
  },
  rightActionContainer: {
    flexGrow: 1,
    display: 'flex',
    justifyContent: 'flex-end',
    alignContent: 'center',
  },
}));

export default function Filters(props) {
  const {filterKey} = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  const rowsPerPageOptions = [10, 25, 50];
  const DEFAULT_ROWS_PER_PAGE = 50;
  const {jobs: totalRunningJobs, nextPageURL: runningNextPageURL, status: runnningStatus} = useSelector(state =>
    selectors.runningJobs(state)
  );
  const {jobs: totalCompletedJobs, nextPageURL: completedNextPageURL, status: completedStatus} = useSelector(state =>
    selectors.completedJobs(state)
  );
  const totalJobs = filterKey === FILTER_KEYS_AD.RUNNING ? totalRunningJobs : totalCompletedJobs;
  const nextPageURL = filterKey === FILTER_KEYS_AD.RUNNING ? runningNextPageURL : completedNextPageURL;

  const status = filterKey === FILTER_KEYS_AD.RUNNING ? runnningStatus : completedStatus;

  const jobFilter = useSelector(state => selectors.filter(state, filterKey));
  const {currPage = 0,
    rowsPerPage = DEFAULT_ROWS_PER_PAGE,
  } = jobFilter?.paging || {};

  const patchFilter = useCallback(
    (key, value) => {
      const filter = { [key]: value };

      if (key !== 'currentPage') {
        filter.currentPage = 0;
      }

      dispatch(actions.patchFilter(filterKey, filter));
    },
    [dispatch, filterKey]
  );
  const defaultRange = {
    startDate: startOfDay(addDays(new Date(), -1)),
    endDate: new Date(),
    preset: null,
  };
  const defaultFilter = filterKey === FILTER_KEYS_AD.RUNNING ? DEFAULTS_RUNNING_JOBS_FILTER : DEFAULTS_COMPLETED_JOBS_FILTER;

  const loadMoreJobs = useCallback(
    () => {
      if (filterKey === FILTER_KEYS_AD.RUNNING) { return dispatch(actions.job.dashboard.running.requestCollection(nextPageURL)); }

      return dispatch(actions.job.dashboard.completed.requestCollection(nextPageURL));
    },
    [dispatch, filterKey, nextPageURL],
  );
  const paginationOptions = useMemo(
    () => ({
      loadMoreHandler: loadMoreJobs,
      hasMore: !!nextPageURL,
      loading: status === 'requested',

    }),
    [loadMoreJobs, nextPageURL, status]
  );
  const handleChangeRowsPerPage = useCallback(e => {
    dispatch(
      actions.patchFilter(filterKey, {
        paging: {
          ...jobFilter.paging,
          rowsPerPage: parseInt(e.target.value, 10),
        },
      })
    );
  }, [dispatch, filterKey, jobFilter?.paging]);
  const handleChangePage = useCallback(
    (e, newPage) => dispatch(
      actions.patchFilter(filterKey, {
        paging: {
          ...jobFilter.paging,
          currPage: newPage,
        },
      })
    ),
    [dispatch, filterKey, jobFilter?.paging]
  );
  const isDateFilterSelected = !!(jobFilter.range && jobFilter.range.preset !== defaultRange.preset);

  const selectedDate = useMemo(() => isDateFilterSelected ? {
    startDate: new Date(jobFilter.range?.startDate),
    endDate: new Date(jobFilter.range?.endDate),
    preset: jobFilter.range?.preset,
  } : defaultRange, [defaultRange, isDateFilterSelected, jobFilter.range?.endDate, jobFilter.range?.preset, jobFilter.range?.startDate]);

  const handleDateFilter = useCallback(
    dateFilter => {
      const selectedRange = getSelectedRange(dateFilter);

      dispatch(
        actions.patchFilter(filterKey, {
          ...jobFilter,
          range: selectedRange,
        })
      );
    },
    [dispatch, filterKey, jobFilter],
  );

  const handleRefreshClick = useCallback(() => {
    dispatch(actions.patchFilter(filterKey, {...defaultFilter }));
    patchFilter(
      'refreshAt',
      new Date().getTime()
    ); /** We are setting the refreshAt (not sending to api) to make sure the filter changes when user clicks refresh.  */
  }, [defaultFilter, dispatch, filterKey, patchFilter]);

  return (
    <div className={classes.root}>
      <div className={classes.filterContainer}>
        {filterKey === FILTER_KEYS_AD.COMPLETED ? (
          <div className={classes.rangeFilter}>
            <Typography variant="body2"> Completed date range:</Typography>
            <DateRangeSelector
              clearable
              placement="right"
              clearValue={defaultRange}
              onSave={handleDateFilter}
              value={selectedDate}
              customPresets={ACCOUNT_DASHBOARD_COMPLETED_JOBS_RANGE_FILTERS}
              fromDate={startOfDay(addDays(new Date(), -29))}
              showTime={false} />
          </div>

        ) : ''}
        <div className={classes.rightActionContainer}>
          <CeligoPagination
            {...paginationOptions}
            rowsPerPageOptions={rowsPerPageOptions}
            className={classes.tablePaginationRoot}
            count={totalJobs?.length}
            page={currPage}
            rowsPerPage={rowsPerPage}
            resultPerPageLabel="Results per page:"
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
          />
          <IconTextButton onClick={handleRefreshClick}>
            <RefreshIcon /> Refresh
          </IconTextButton>
        </div>
      </div>
    </div>
  );
}

