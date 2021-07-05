import React, { useEffect, useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { makeStyles } from '@material-ui/core';
import { addDays, startOfDay, endOfDay } from 'date-fns';
import CeligoPagination from '../../CeligoPagination';
import { selectors } from '../../../reducers';
import actions from '../../../actions';
import ResourceTable from '../../ResourceTable';
import { isNewId } from '../../../utils/resource';
import RefreshIcon from '../../icons/RefreshIcon';
import IconTextButton from '../../IconTextButton';
import { getSelectedRange } from '../../../utils/flowMetrics';
import DateRangeSelector from '../../DateRangeSelector';
import { FILTER_KEYS, ERROR_MANAGEMENT_RANGE_FILTERS } from '../../../utils/errorManagement';
import Spinner from '../../Spinner';
import MessageWrapper from '../../MessageWrapper';

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
  rangeFilter: {
    padding: 5,
  },
}));

const defaultRange = {
  startDate: startOfDay(addDays(new Date(), -29)),
  endDate: endOfDay(new Date()),
  preset: null,
};

const ROWS_PER_PAGE = 50;

export default function RunHistory({ flowId }) {
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

    return () => {
      dispatch(actions.clearFilter(FILTER_KEYS.RUN_HISTORY));
      dispatch(actions.errorManager.runHistory.clear({ flowId }));
    };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const handleChangePage = useCallback((event, newPage) => {
    setCurrentPage(newPage);
  }, []);

  const jobsInCurrentPage = useMemo(
    () => runHistory?.slice(currentPage * ROWS_PER_PAGE, (currentPage + 1) * ROWS_PER_PAGE),
    [runHistory, currentPage]
  );

  return (
    <>
      <div className={classes.filterContainerRunHistory}>
        <>
          <div className={classes.rangeFilter}>
            <DateRangeSelector
              clearable
              placement="right"
              clearValue={defaultRange}
              onSave={handleDateFilter}
              value={selectedDate}
              customPresets={ERROR_MANAGEMENT_RANGE_FILTERS}
              fromDate={startOfDay(addDays(new Date(), -29))}
              showTime={false}
         />
          </div>
          <div className={classes.actions}>
            { hasFlowRunHistory && (
            <CeligoPagination
              count={runHistory.length}
              page={currentPage}
              rowsPerPage={ROWS_PER_PAGE}
              onChangePage={handleChangePage}
              />
            )}
            <IconTextButton onClick={fetchFlowRunHistory} disabled={isLoadingHistory}>
              <RefreshIcon /> Refresh
            </IconTextButton>
          </div>
        </>
      </div>
      { isLoadingHistory && <Spinner centerAll />}
      { !hasFlowRunHistory &&
        (
        <MessageWrapper>
          You don&apos;t have any run history.
        </MessageWrapper>
        )}
      {
          hasFlowRunHistory &&
          <ResourceTable resources={jobsInCurrentPage} resourceType={FILTER_KEYS.RUN_HISTORY} />
      }
    </>
  );
}
