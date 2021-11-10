import React, { useEffect, useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import clsx from 'clsx';
import { makeStyles, FormControlLabel, Checkbox, MenuItem } from '@material-ui/core';
import { addDays, startOfDay, endOfDay } from 'date-fns';
import CeligoSelect from '../../CeligoSelect';
import CeligoPagination from '../../CeligoPagination';
import { selectors } from '../../../reducers';
import actions from '../../../actions';
import ResourceTable from '../../ResourceTable';
import { isNewId } from '../../../utils/resource';
import RefreshIcon from '../../icons/RefreshIcon';
import { getSelectedRange } from '../../../utils/flowMetrics';
import DateRangeSelector from '../../DateRangeSelector';
import { FILTER_KEYS, ERROR_MANAGEMENT_RANGE_FILTERS } from '../../../utils/errorManagement';
import Spinner from '../../Spinner';
import MessageWrapper from '../../MessageWrapper';
import { hashCode } from '../../../utils/string';
import { TextButton } from '../../Buttons';
import ActionGroup from '../../ActionGroup';

const useStyles = makeStyles(theme => ({
  actions: {
    margin: 10,
    display: 'flex',
    justifyContent: 'space-between',
  },
  noHistory: {
    textAlign: 'center',
    display: 'flex',
  },
  filterContainerRunHistory: {
    border: `solid 1px ${theme.palette.secondary.lightest}`,
    borderWidth: [[1, 0]],
    display: 'flex',
    position: 'sticky',
    top: 0,
    padding: theme.spacing(1),
    zIndex: 1,
    justifyContent: 'space-between',
    background: theme.palette.background.default,
  },
  runHistoryPagination: {
    '& > div': {
      marginRight: theme.spacing(-2) },
  },
  wrapper: {
    position: 'relative',
  },
  hideWrapper: {
    display: 'none',
  },
  hideEmptyLabel: {
    marginTop: theme.spacing(0.5),
  },
  hideLabel: {
    marginLeft: theme.spacing(1),
  },
  filterButton: {
    borderRadius: theme.spacing(0.5),
    height: theme.spacing(4.5),
    '&:first-child': {
      marginLeft: 0,
    },
  },
  status: {
    minWidth: 134,
  },
}));

const defaultRange = {
  startDate: startOfDay(addDays(new Date(), -29)),
  endDate: endOfDay(new Date()),
  preset: null,
};

const ROWS_PER_PAGE = 50;

export default function RunHistory({ flowId, className }) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const [currentPage, setCurrentPage] = useState(0);
  const isLoadingHistory = useSelector(state => {
    if (isNewId(flowId)) return false;
    const {status} = selectors.runHistoryContext(state, flowId);

    return !status || status === 'requested';
  });

  const runHistory = useSelector(state => selectors.runHistoryContext(state, flowId).data);

  const filter = useSelector(state =>
    selectors.filter(state, FILTER_KEYS.RUN_HISTORY),
  shallowEqual
  );
  const filterHash = hashCode(filter.status);

  const isDateFilterSelected = !!(filter.range && filter.range.preset !== defaultRange.preset);
  const selectedDate = useMemo(() => isDateFilterSelected ? {
    startDate: new Date(filter.range.startDate),
    endDate: new Date(filter.range.endDate),
    preset: filter.range.preset,
  } : defaultRange, [isDateFilterSelected, filter]);

  const fetchFlowRunHistory = useCallback(
    () => {
      if (flowId && !isNewId(flowId)) {
        setCurrentPage(0);
        dispatch(actions.errorManager.runHistory.request({ flowId }));
      }
    },
    [flowId, dispatch],
  );

  useEffect(() => {
    fetchFlowRunHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterHash]);

  useEffect(() =>
    () => {
      dispatch(actions.clearFilter(FILTER_KEYS.RUN_HISTORY));
      dispatch(actions.errorManager.runHistory.clear({ flowId }));
    },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  []);

  const hasFlowRunHistory = !isLoadingHistory && !!runHistory?.length;

  const handleDateFilter = useCallback(
    dateFilter => {
      const selectedRange = getSelectedRange(dateFilter);

      dispatch(
        actions.patchFilter(FILTER_KEYS.RUN_HISTORY, {
          ...filter,
          range: selectedRange,
        })
      );
      fetchFlowRunHistory();
    },
    [dispatch, fetchFlowRunHistory, filter],
  );
  const patchFilter = useCallback(
    (key, value) => {
      const filter = { [key]: value };

      dispatch(
        actions.patchFilter(FILTER_KEYS.RUN_HISTORY, filter)
      );
      fetchFlowRunHistory();
    },
    [dispatch, fetchFlowRunHistory]
  );

  const handleChangePage = useCallback((event, newPage) => {
    setCurrentPage(newPage);
  }, []);

  const jobsInCurrentPage = useMemo(
    () => runHistory?.slice(currentPage * ROWS_PER_PAGE, (currentPage + 1) * ROWS_PER_PAGE),
    [runHistory, currentPage]
  );

  return (
    <div className={clsx(classes.wrapper, className)}>
      <div className={classes.filterContainerRunHistory}>
        <>
          <ActionGroup>
            <DateRangeSelector
              clearable
              placement="right"
              clearValue={defaultRange}
              onSave={handleDateFilter}
              value={selectedDate}
              customPresets={ERROR_MANAGEMENT_RANGE_FILTERS}
              fromDate={startOfDay(addDays(new Date(), -29))}
         />
            <CeligoSelect
              data-test="flowStatusFilter"
              className={clsx(classes.filterButton, classes.status)}
              onChange={e => patchFilter('status', e.target.value)}
              value={filter?.status || 'all'}>
              {[
                ['all', 'Select status'],
                ['error', 'Contains error'],
                ['canceled', 'Canceled'],
                ['completed', 'Completed'],
                ['failed', 'Failed'],
              ].map(opt => (
                <MenuItem key={opt[0]} value={opt[0]}>
                  {opt[1]}
                </MenuItem>
              ))}
            </CeligoSelect>
            <FormControlLabel
              className={classes.hideLabel}
              data-test="hideEmptyRunsFilter"
              label="Hide empty runs"
              control={(
                <Checkbox
                  checked={filter?.hideEmpty}
                  data-test="hideEmptyRuns"
                  color="primary"
                  onChange={e => patchFilter('hideEmpty', e.target.checked)} />
                  )}
                />
          </ActionGroup>
          <ActionGroup position="right">
            { hasFlowRunHistory && (
            <CeligoPagination
              className={classes.runHistoryPagination}
              count={runHistory.length}
              page={currentPage}
              rowsPerPage={ROWS_PER_PAGE}
              onChangePage={handleChangePage}
              />
            )}
            <TextButton
              onClick={fetchFlowRunHistory}
              disabled={isLoadingHistory}
              startIcon={<RefreshIcon />}>
              Refresh
            </TextButton>
          </ActionGroup>
        </>
      </div>
      {isLoadingHistory && <Spinner centerAll />}

      <ResourceTable resources={jobsInCurrentPage} resourceType={FILTER_KEYS.RUN_HISTORY} />

      {!hasFlowRunHistory &&
        (
        <MessageWrapper className={clsx({[classes.hideWrapper]: isLoadingHistory})}>
          You don&apos;t have any run history.
        </MessageWrapper>
        )}
    </div>
  );
}
