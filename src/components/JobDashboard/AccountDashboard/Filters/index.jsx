import React, { useMemo, useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { addDays, startOfDay } from 'date-fns';
import { useRouteMatch } from 'react-router-dom';
import { selectors } from '../../../../reducers';
import actions from '../../../../actions';
import RefreshIcon from '../../../icons/RefreshIcon';
import CeligoPagination from '../../../CeligoPagination';
import DateRangeSelector from '../../../DateRangeSelector';
import { FILTER_KEYS_AD,
  DEFAULTS_COMPLETED_JOBS_FILTER,
  DEFAULTS_RUNNING_JOBS_FILTER,
  DEFAULT_ROWS_PER_PAGE,
  getDashboardIntegrationId,
  DEFAULT_RANGE,
  ROWS_PER_PAGE_OPTIONS} from '../../../../utils/accountDashboard';
import { addDataRetentionPeriods, getSelectedRange } from '../../../../utils/flowMetrics';
import { TextButton } from '../../../Buttons';

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: -1,
    paddingBottom: theme.spacing(1.5),
    backgroundColor: theme.palette.background.paper,
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

export default function Filters({filterKey}) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const match = useRouteMatch();
  let { integrationId } = match.params;
  const { childId } = match.params;
  const isIntegrationAppV1 = useSelector(state => selectors.isIntegrationAppV1(state, integrationId));

  integrationId = getDashboardIntegrationId(integrationId, childId, isIntegrationAppV1);
  const integrationFilterKey = `${integrationId || ''}${filterKey}`;
  const {jobs, nextPageURL, status} = useSelector(state => selectors.accountDashboardJobs(state, filterKey));

  const jobFilter = useSelector(state => selectors.filter(state, integrationFilterKey));
  const {currPage = 0,
    rowsPerPage = DEFAULT_ROWS_PER_PAGE,
  } = jobFilter?.paging || {};
  const areUserAccountSettingsLoaded = useSelector(selectors.areUserAccountSettingsLoaded);
  const maxAllowedDataRetention = useSelector(state => selectors.platformLicense(state)?.maxAllowedDataRetention);
  const isAccountOwnerOrAdmin = useSelector(state => selectors.isAccountOwnerOrAdmin(state));
  const dataRetentionPeriod = useSelector(state => {
    if (isAccountOwnerOrAdmin) {
      return selectors.dataRetentionPeriod(state);
    }

    const accounts = selectors.accountSummary(state);
    const selectedAccount = accounts?.find(a => a.selected);

    return selectedAccount?.dataRetentionPeriod;
  });
  const maxAllowedDate = (dataRetentionPeriod || maxAllowedDataRetention) || 30;
  const addCustomPeriods = useMemo(() =>
    addDataRetentionPeriods(maxAllowedDataRetention, dataRetentionPeriod),
  [dataRetentionPeriod, maxAllowedDataRetention]);

  const patchFilter = useCallback(
    (key, value) => {
      const filter = { [key]: value };

      if (key !== 'currentPage') {
        filter.currentPage = 0;
      }
      dispatch(actions.patchFilter(integrationFilterKey, filter));
    },
    [dispatch, integrationFilterKey]
  );
  const defaultFilter = integrationFilterKey === `${integrationId}${FILTER_KEYS_AD.RUNNING}` ? DEFAULTS_RUNNING_JOBS_FILTER : DEFAULTS_COMPLETED_JOBS_FILTER;

  const loadMoreJobs = useCallback(
    () => {
      if (integrationFilterKey === `${integrationId}${FILTER_KEYS_AD.RUNNING}`) { return dispatch(actions.job.dashboard.running.requestCollection({nextPageURL, integrationId})); }

      return dispatch(actions.job.dashboard.completed.requestCollection({nextPageURL, integrationId}));
    },
    [dispatch, integrationFilterKey, integrationId, nextPageURL],
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
      actions.patchFilter(integrationFilterKey, {
        paging: {
          ...jobFilter?.paging,
          rowsPerPage: parseInt(e.target.value, 10),
        },
      })
    );
  }, [dispatch, integrationFilterKey, jobFilter?.paging]);
  const handleChangePage = useCallback(
    (e, newPage) => dispatch(
      actions.patchFilter(integrationFilterKey, {
        paging: {
          ...jobFilter?.paging,
          currPage: newPage,
        },
      })
    ),
    [dispatch, integrationFilterKey, jobFilter?.paging]
  );
  const isDateFilterSelected = !!(jobFilter?.range && jobFilter?.range.preset !== DEFAULT_RANGE.preset);

  const selectedDate = useMemo(() => isDateFilterSelected ? {
    startDate: new Date(jobFilter?.range?.startDate),
    endDate: new Date(jobFilter?.range?.endDate),
    preset: jobFilter?.range?.preset,
  } : DEFAULT_RANGE, [isDateFilterSelected, jobFilter?.range?.endDate, jobFilter?.range?.preset, jobFilter?.range?.startDate]);

  const handleDateFilter = useCallback(
    dateFilter => {
      const selectedRange = getSelectedRange(dateFilter);

      dispatch(
        actions.patchFilter(integrationFilterKey, {
          ...jobFilter,
          range: selectedRange,
        })
      );
    },
    [dispatch, integrationFilterKey, jobFilter],
  );

  const handleRefreshClick = useCallback(() => {
    dispatch(actions.patchFilter(integrationFilterKey, {...defaultFilter }));
    patchFilter(
      'refreshAt',
      new Date().getTime()
    ); /** We are setting the refreshAt (not sending to api) to make sure the filter changes when user clicks refresh.  */
  }, [defaultFilter, dispatch, integrationFilterKey, patchFilter]);

  useEffect(() => {
    if (!areUserAccountSettingsLoaded && isAccountOwnerOrAdmin) {
      dispatch(actions.accountSettings.request());
    }
  }, [areUserAccountSettingsLoaded, dispatch, isAccountOwnerOrAdmin]);

  return (
    <div className={classes.root}>
      <div className={classes.filterContainer}>
        {filterKey === FILTER_KEYS_AD.COMPLETED ? (
          <div className={classes.rangeFilter}>
            <Typography variant="body2"> Completed date range:</Typography>
            <DateRangeSelector
              clearable
              placement="right"
              clearValue={DEFAULT_RANGE}
              onSave={handleDateFilter}
              showCustomRangeValue
              value={selectedDate}
              customPresets={addCustomPeriods}
              fromDate={startOfDay(addDays(new Date(), -(maxAllowedDate - 1)))}
              showTime={false} />
          </div>

        ) : ''}
        <div className={classes.rightActionContainer}>
          {jobs?.length ? (
            <CeligoPagination
              {...paginationOptions}
              rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
              className={classes.tablePaginationRoot}
              count={jobs?.length}
              page={currPage}
              rowsPerPage={rowsPerPage}
              resultPerPageLabel="Results per page:"
              onChangePage={handleChangePage}
              onChangeRowsPerPage={handleChangeRowsPerPage}
            />
            )
            : '' }
          <TextButton onClick={handleRefreshClick} startIcon={<RefreshIcon />}>
            Refresh
          </TextButton>
        </div>
      </div>
    </div>
  );
}

