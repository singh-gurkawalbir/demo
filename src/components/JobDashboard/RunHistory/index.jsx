import React, { useEffect, useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { makeStyles } from '@material-ui/core';
import { addDays, startOfDay, endOfDay } from 'date-fns';
import CeligoPagination from '../../CeligoPagination';
import { selectors } from '../../../reducers';
import actions from '../../../actions';
import ResourceTable from '../../ResourceTable';
import PanelLoader from '../../PanelLoader';
import { isNewId } from '../../../utils/resource';
import RefreshIcon from '../../icons/RefreshIcon';
import IconTextButton from '../../IconTextButton';
import { getSelectedRange } from '../../../utils/flowMetrics';
import DateRangeSelector from '../../DateRangeSelector';
import { FILTER_KEYS } from '../../../utils/errorManagement';

const useStyles = makeStyles(() => ({
  actions: {
    margin: 10,
    display: 'flex',
    justifyContent: 'space-between',
  },
}));

const defaultRange = {
  startDate: startOfDay(addDays(new Date(), -29)),
  endDate: endOfDay(new Date()),
  preset: null,
};

const rangeFilters = [
  {id: 'today', label: 'Today'},
  {id: 'yesterday', label: 'Yesterday'},
  {id: 'last24hours', label: 'Last 24 hours'},
  {id: 'last7days', label: 'Last 7 Days'},
  {id: 'last15days', label: 'Last 15 Days'},
  {id: 'last30days', label: 'Last 30 Days'},
  {id: 'custom', label: 'Custom'},
];

const ROWS_PER_PAGE = 50;

export default function RunHistory({ flowId }) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const [currentPage, setCurrentPage] = useState(0);

  const runHistoryContext = useSelector(state => selectors.runHistoryContext(state, flowId));
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

  useEffect(() => {
    setCurrentPage(0);
  }, [filter.range]);

  const isLoading = runHistoryContext.status === 'requested';

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
    () => runHistoryContext.data?.slice(currentPage * ROWS_PER_PAGE, (currentPage + 1) * ROWS_PER_PAGE),
    [runHistoryContext.data, currentPage]
  );

  if (!runHistoryContext.data) {
    return null;
  }

  return (
    <>
      <div className={classes.actions}>
        <DateRangeSelector
          clearable
          placement="right"
          classProps={classes}
          clearValue={defaultRange}
          onSave={handleDateFilter}
          value={selectedDate}
          customPresets={rangeFilters}
          fromDate={startOfDay(addDays(new Date(), -29))}
          showTime={false}
         />
        <div className={classes.actions}>
          {
          runHistoryContext.data?.length && !isLoading
            ? (
              <CeligoPagination
                count={runHistoryContext.data?.length}
                page={currentPage}
                rowsPerPage={ROWS_PER_PAGE}
                onChangePage={handleChangePage}
              />
            )
            : null
        }
          <IconTextButton onClick={fetchFlowRunHistory} disabled={isLoading}>
            <RefreshIcon /> Refresh
          </IconTextButton>
        </div>
      </div>
      {
          isLoading
            ? <PanelLoader />
            : <ResourceTable resources={jobsInCurrentPage} resourceType={FILTER_KEYS.RUN_HISTORY} />
      }
    </>
  );
}
