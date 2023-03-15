import React, { useEffect, useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import clsx from 'clsx';
import { FormControlLabel, Checkbox, MenuItem } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { addDays, startOfDay, endOfDay } from 'date-fns';
import CeligoSelect from '../../CeligoSelect';
import CeligoPagination from '../../CeligoPagination';
import { selectors } from '../../../reducers';
import actions from '../../../actions';
import { isNewId } from '../../../utils/resource';
import RefreshIcon from '../../icons/RefreshIcon';
import { addDataRetentionPeriods, getSelectedRange } from '../../../utils/flowMetrics';
import DateRangeSelector from '../../DateRangeSelector';
import { FILTER_KEYS } from '../../../utils/errorManagement';
import Spinner from '../../Spinner';
import NoResultTypography from '../../NoResultTypography';
import { hashCode } from '../../../utils/string';
import { TextButton } from '../../Buttons';
import ActionGroup from '../../ActionGroup';
import {RUN_HISTORY_STATUS_OPTIONS} from '../../../utils/accountDashboard';
import JobTable from './JobTable';
import useEnqueueSnackbar from '../../../hooks/enqueueSnackbar';
import messageStore, { message } from '../../../utils/messageStore';

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
    backgroundColor: theme.palette.background.paper,
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
  const defaultRange = useMemo(
    () => ({
      startDate: startOfDay(addDays(new Date(), -29)),
      endDate: endOfDay(new Date()),
      preset: null,
    }),
    []
  );
  const runHistory = useSelector(state => selectors.runHistoryContext(state, flowId).data);

  const filter = useSelector(state =>
    selectors.filter(state, FILTER_KEYS.RUN_HISTORY),
  shallowEqual
  );
  const filterHash = hashCode(`${filter.status}${filter.hideEmpty}`);

  const isDateFilterSelected = !!(filter.range && filter.range.preset !== defaultRange.preset);
  const selectedDate = useMemo(() => isDateFilterSelected ? {
    startDate: new Date(filter.range.startDate),
    endDate: new Date(filter.range.endDate),
    preset: filter.range.preset,
  } : defaultRange, [defaultRange, isDateFilterSelected, filter]);
  const [enqueueSnackbar] = useEnqueueSnackbar();
  const isPurgeFilesSuccess = useSelector(state => selectors.isPurgeFilesSuccess(state));
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
    },
    [dispatch]
  );

  const handleChangePage = useCallback((event, newPage) => {
    setCurrentPage(newPage);
  }, []);

  const jobsInCurrentPage = useMemo(
    () => runHistory?.slice(currentPage * ROWS_PER_PAGE, (currentPage + 1) * ROWS_PER_PAGE),
    [runHistory, currentPage]
  );

  useEffect(() => {
    if (!areUserAccountSettingsLoaded && isAccountOwnerOrAdmin) {
      dispatch(actions.accountSettings.request());
    }
  }, [areUserAccountSettingsLoaded, dispatch, isAccountOwnerOrAdmin]);

  useEffect(() => {
    if (isPurgeFilesSuccess) {
      dispatch(actions.job.purge.clear());
      dispatch(actions.errorManager.runHistory.request({ flowId }));
      enqueueSnackbar({
        message: message.PURGE.FILE_PURGE_SUCCESS_MESSAGE,
        variant: 'success',
      });
    }
  }, [dispatch, enqueueSnackbar, flowId, isPurgeFilesSuccess]);

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
              showCustomRangeValue
              value={selectedDate}
              customPresets={addCustomPeriods}
              fromDate={startOfDay(addDays(new Date(), -(maxAllowedDate - 1)))}
         />
            <CeligoSelect
              data-test="flowStatusFilter"
              className={clsx(classes.filterButton, classes.status)}
              onChange={e => patchFilter('status', e.target.value)}
              value={filter?.status || 'all'}>
              {RUN_HISTORY_STATUS_OPTIONS.map(opt => (
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
      {isLoadingHistory ? <Spinner loading size="large" />
        : (
          <JobTable
            classes={classes.jobTable}
            jobsInCurrentPage={jobsInCurrentPage || []} />
        )}

      {(!hasFlowRunHistory && !isLoadingHistory) &&
        (
        <NoResultTypography isBackground className={clsx({[classes.hideWrapper]: isLoadingHistory})}>
          {messageStore('NO_RESULT', {message: 'run history'})}
        </NoResultTypography>
        )}
    </div>
  );
}
