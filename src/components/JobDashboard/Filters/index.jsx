import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import clsx from 'clsx';
import { MenuItem, Checkbox, FormControlLabel, IconButton, Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { addDays, startOfDay, endOfDay } from 'date-fns';
import { selectors } from '../../../reducers';
import actions from '../../../actions';
import ArrowLeftIcon from '../../icons/ArrowLeftIcon';
import ArrowRightIcon from '../../icons/ArrowRightIcon';
import RefreshIcon from '../../icons/RefreshIcon';
import RunFlowButton from '../../RunFlowButton';
import CeligoSelect from '../../CeligoSelect';
import FlowSelector from '../FlowSelector';
import DateRangeSelector from '../../DateRangeSelector';
import { getSelectedRange } from '../../../utils/flowMetrics';
import { TextButton } from '../../Buttons';
import CeligoDivider from '../../CeligoDivider';

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: -1,
    paddingBottom: theme.spacing(1.5),
    backgroundColor: theme.palette.background.paper,
    overflowX: 'auto',
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
}));
const rangeFilters = [
  {id: 'today', label: 'Today'},
  {id: 'yesterday', label: 'Yesterday'},
  {id: 'last7days', label: 'Last 7 days'},
  {id: 'last15days', label: 'Last 15 days'},
  {id: 'last30days', label: 'Last 30 days'},
  {id: 'custom', label: 'Custom'},
];
const defaultRange = {
  startDate: startOfDay(addDays(new Date(), -29)),
  endDate: endOfDay(new Date()),
  preset: null,
};

export default function Filters({
  integrationId,
  flowId,
  filterKey,
  onActionClick,
  numJobsSelected = 0,
  numRetriableJobsSelected = 0,
  disableRetry = true,
  disableResolve = true,
  isFlowBuilderView = false,
}) {
  const classes = useStyles();
  const dispatch = useDispatch();
  // #region data-layer selectors
  const { paging = {}, totalJobs = 0 } = useSelector(state =>
    selectors.flowJobsPagingDetails(state)
  );
  const {
    childId,
    flowId: filterFlowId,
    status = 'all',
    hideEmpty = false,
    currentPage = 0,
    dateRange,
  } = useSelector(state => selectors.filter(state, filterKey));

  // #endregion
  const { rowsPerPage } = paging;
  const maxPage = Math.ceil(totalJobs / rowsPerPage) - 1;
  const firstRowIndex = rowsPerPage * currentPage;
  const patchFilter = useCallback(
    (key, value) => {
      const filter = { [key]: value };

      // any time a filter changes (that is not setting the page)
      // we need to reset the results to show the first page.
      if (key !== 'currentPage') {
        filter.currentPage = 0;
      }

      if (key === 'childId') {
        filter.flowId = '';
      }

      dispatch(actions.patchFilter(filterKey, filter));
    },
    [dispatch, filterKey]
  );

  const handlePageChange = useCallback(
    offset => () => {
      patchFilter('currentPage', currentPage + offset);
    },
    [currentPage, patchFilter]
  );

  const handleDateRangeChange = useCallback(range => {
    patchFilter('dateRange', [getSelectedRange(range)]);
  }, [patchFilter]);

  const handleRefreshClick = useCallback(() => {
    dispatch(actions.job.clear());
    patchFilter('currentPage', 0);
    patchFilter(
      'refreshAt',
      new Date().getTime()
    ); /** We are setting the refreshAt (not sending to api) to make sure the filter changes when user clicks refresh.  */
  }, [dispatch, patchFilter]);

  return (
    <div className={classes.root}>
      <div className={classes.filterContainer}>
        <CeligoSelect
          className={clsx(classes.filterButton, classes.retry)}
          data-test="retryJobs"
          onChange={e => onActionClick(e.target.value)}
          displayEmpty
          disabled={disableRetry}
          value="">
          <MenuItem value="" disabled>
            Retry
          </MenuItem>
          <MenuItem value="retryAll" disabled={!['all', 'error'].includes(status) || ![null, undefined, 'last30days'].includes(dateRange?.[0]?.preset)} >
            {isFlowBuilderView ? 'All jobs' : 'All enabled flow jobs'}
          </MenuItem>
          <MenuItem disabled={numRetriableJobsSelected === 0} value="retrySelected">
            {numRetriableJobsSelected} {isFlowBuilderView ? 'selected jobs' : 'selected enabled flow jobs'}
          </MenuItem>
        </CeligoSelect>

        <CeligoSelect
          disabled={disableResolve}
          data-test="resolveJobs"
          className={clsx(classes.filterButton, classes.resolve)}
          onChange={e => onActionClick(e.target.value)}
          displayEmpty
          value="">
          <MenuItem value="" disabled>
            Resolve
          </MenuItem>
          <MenuItem value="resolveAll">All jobs</MenuItem>
          <MenuItem value="resolveSelected" disabled={numJobsSelected === 0}>
            {numJobsSelected} selected jobs
          </MenuItem>
        </CeligoSelect>

        <CeligoDivider height="large" />
        <Typography>Filter by: </Typography>

        {!flowId && (
        <FlowSelector
          integrationId={integrationId}
          data-test="selectAFlow"
          childId={childId}
          value={filterFlowId}
          onChange={flowId => patchFilter('flowId', flowId)}
        />
        )}

        <CeligoSelect
          data-test="flowStatusFilter"
          className={clsx(classes.filterButton, classes.status)}
          onChange={e => patchFilter('status', e.target.value)}
          value={status}>
          {[
            ['all', 'Select status'],
            ['error', 'Contains error'],
            ['resolved', 'Contains resolved'],
            ['running', 'In progress'],
            ['retrying', 'Retrying'],
            ['queued', 'Queued'],
            ['canceled', 'Canceled'],
            ['completed', 'Completed'],
            ['failed', 'Failed'],
          ].map(opt => (
            <MenuItem key={opt[0]} value={opt[0]}>
              {opt[1]}
            </MenuItem>
          ))}
        </CeligoSelect>
        <DateRangeSelector
          value={dateRange || defaultRange}
          clearable
          placement={isFlowBuilderView ? 'right' : 'bottom'}
          customPresets={rangeFilters}
          clearValue={defaultRange}
          showCustomRangeValue
          onSave={handleDateRangeChange}
          fromDate={startOfDay(addDays(new Date(), -29))}
          showTime={false} />
        <div className={classes.hideLabel}>
          <FormControlLabel
            data-test="hideEmptyJobsFilter"
            label="Hide empty jobs"
            control={(
              <Checkbox
              // indeterminate={numSelected > 0 && numSelected < rowCount}
                checked={hideEmpty}
                data-test="hideEmptyJobs"
                color="primary"
                onChange={e => patchFilter('hideEmpty', e.target.checked)}
            />
            )}
        />
        </div>

        <div className={classes.rightActionContainer}>
          {maxPage > 0 && (
          <>
            <IconButton
              disabled={currentPage === 0}
              size="small"
              data-test="decrementPage"
              onClick={handlePageChange(-1)}>
              <ArrowLeftIcon />
            </IconButton>
            <div className={classes.pagingText}>
              {firstRowIndex + 1}
              {' - '}
              {currentPage === maxPage
                ? totalJobs
                : firstRowIndex + rowsPerPage}{' '}
              of {totalJobs}
            </div>
            <IconButton
              data-test="incrementPage"
              disabled={maxPage === currentPage}
              size="small"
              onClick={handlePageChange(1)}>
              <ArrowRightIcon />
            </IconButton>
          </>
          )}
          <TextButton onClick={handleRefreshClick} startIcon={<RefreshIcon />}>
            Refresh
          </TextButton>
          {flowId && (<RunFlowButton variant="iconText" flowId={flowId} />)}
        </div>
      </div>
    </div>
  );
}

