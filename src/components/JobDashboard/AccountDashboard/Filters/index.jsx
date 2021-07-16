import React, { useMemo, useCallback, Fragment } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  makeStyles,
} from '@material-ui/core';
import { addDays, startOfDay, endOfDay } from 'date-fns';
import { selectors } from '../../../../reducers';
import actions from '../../../../actions';
import RefreshIcon from '../../../icons/RefreshIcon';
import IconTextButton from '../../../IconTextButton';
import CeligoPagination from '../../../CeligoPagination';
import DateRangeSelector from '../../../DateRangeSelector';
import { FILTER_KEYS, ACCOUNT_DASHBOARD_COMPLETED_JOBS_RANGE_FILTERS } from '../../../../utils/accountDashboard';
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
    padding: 5,
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
      '&:first-child': {
        marginLeft: 10,
      },
    },
  },
  filterButton: {
    borderRadius: theme.spacing(0.5),
    height: theme.spacing(4.5),
    '&:first-child': {
      marginLeft: 0,
    },
  },
  retry: {
    minWidth: 90,
  },
  resolve: {
    minWidth: 100,
  },
  status: {
    minWidth: 134,
  },
  hideEmptyLabel: {
    marginTop: theme.spacing(0.5),
  },
  rightActionContainer: {
    flexGrow: 1,
    display: 'flex',
    justifyContent: 'flex-end',
    alignContent: 'center',
  },
  pagingText: {
    alignSelf: 'center',
  },
  hideLabel: {
    marginLeft: '10px',
  },
  dateLabel: {
    marginRight: '10px',
  },
  divider: {
    width: 1,
    height: 20,
    borderLeft: `1px solid ${theme.palette.secondary.lightest}`,
    margin: theme.spacing(0, 1.5, 0, 0.25),
  },
}));
const defaultFilter = {
  sort: { order: 'desc', orderBy: 'createdAt' },
  paging: {
    rowsPerPage: 50,
    currPage: 0,
  },
};

export default function Filters(props) {
  const {filterKey} = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  const rowsPerPageOptions = [10, 25, 50];
  const DEFAULT_ROWS_PER_PAGE = 50;
  const {jobs: totalRunningJobs, nextPageURL, status} = useSelector(state =>
    selectors.runningJobs(state)
  );
  const totalCompletedJobs = useSelector(state =>
    selectors.completedJobs(state)
  );
  const totalJobs = filterKey === FILTER_KEYS.RUNNING ? totalRunningJobs : totalCompletedJobs;

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
    startDate: startOfDay(addDays(new Date(), -29)),
    endDate: endOfDay(new Date()),
    preset: null,
  };

  const loadMoreJobs = useCallback(
    () => {
      if (filterKey === FILTER_KEYS.RUNNING) { return dispatch(actions.job.dashboard.running.requestCollection(nextPageURL)); }

      return dispatch(actions.job.dashboard.completed.requestCollection({nextPageURL}));
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
  }, [dispatch, filterKey, patchFilter]);

  return (
    <div className={classes.root}>
      <div className={classes.filterContainer}>
        {filterKey === FILTER_KEYS.COMPLETED ? (
          <>
            <div className={classes.rangeFilter}>
              <> Completed date range: </>
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
          </>

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

