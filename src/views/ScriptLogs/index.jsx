import React, { useMemo, useState, useCallback, useEffect } from 'react';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import { MenuItem } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { addDays, addMinutes, startOfDay } from 'date-fns';
import { Spinner, TextButton } from '@celigo/fuse-ui';
import { selectors } from '../../reducers';
import actions from '../../actions';
import DateRangeSelector from '../../components/DateRangeSelector';
import CeligoSelect from '../../components/CeligoSelect';
import RunFlowButton from '../../components/RunFlowButton';
import StartDebug from '../../components/StartDebug';
import RefreshIcon from '../../components/icons/RefreshIcon';
import CeligoPagination from '../../components/CeligoPagination';
import CeligoTable from '../../components/CeligoTable';
import metadata from '../../components/ResourceTable/scriptLogs/metadata';
import { getSelectedRange } from '../../utils/flowMetrics';
import SelectDependentResource from '../../components/SelectDependentResource';
import { LOG_LEVELS, SCRIPT_FUNCTION_TYPES, SCRIPT_FUNCTION_TYPES_FOR_FLOW } from '../../utils/script';
import FetchProgressIndicator from '../../components/FetchProgressIndicator';
import ViewLogDetailDrawer from './DetailDrawer';
import NoResultTypography from '../../components/NoResultTypography';
import messageStore, { message } from '../../utils/messageStore';
import useEnqueueSnackbar from '../../hooks/enqueueSnackbar';
import ActionMenu from '../../components/CeligoTable/ActionMenu';
import PurgeLog from '../../components/ResourceTable/scriptLogs/actions/PurgeLog';

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: -1,
    padding: theme.spacing(0, 0, 1.5, 0),
    height: '100%',
  },
  filterContainer: {
    display: 'flex',
    position: 'sticky',
    justifyContent: 'space-between',
    background: theme.palette.background.default,
    borderBottom: `1px solid ${theme.palette.secondary.lightest}`,
  },
  tableContainer: {
    height: 'calc(100% - 69px)',
    overflowY: 'auto',
  },
  filterButton: {
    borderRadius: theme.spacing(0.5),
    height: theme.spacing(4.5),
    '&:first-child': {
      marginLeft: 0,
    },
  },
  rightActionContainer: {
    padding: theme.spacing(2, 0),
    display: 'flex',
    alignItems: 'center',
  },
  leftActionContainer: {
    padding: theme.spacing(2, 0),
    display: 'flex',
    alignItems: 'center',
    '& > *': {
      marginRight: 10,
      '&:first-child': {
        marginLeft: 10,
      },
    },
  },
  tablePaginationRoot: {
    float: 'right',
    display: 'flex',
    margin: 'auto',
  },
  divider: {
    marginLeft: 0,
  },
  leftActionItems: {
    borderRight: `1px solid ${theme.palette.secondary.lightest}`,
    margin: 'auto',
    marginRight: theme.spacing(2),
    display: 'flex',
  },
  scriptsFetchLog: {
    backgroundColor: theme.palette.background.paper,
    borderBottom: `1px solid ${theme.palette.secondary.lightest}`,
    padding: '5px 12px',
  },
}));

const rangeFilters = [
  {id: 'last15minutes', label: 'Last 15 minutes'},
  {id: 'last24hours', label: 'Last 24 hours'},
  {id: 'last30minutes', label: 'Last 30 minutes'},
  {id: 'today', label: 'Today'},
  {id: 'last1hour', label: 'Last hour'},
  {id: 'yesterday', label: 'Yesterday'},
  {id: 'last4hours', label: 'Last 4 hours'},
  {id: 'custom', label: 'Custom'},
];
const defaultRange = {
  startDate: addMinutes(new Date(), -15),
  endDate: new Date(),
  preset: 'last15minutes',
};
const emptySet = [];
const rowsPerPageOptions = [10, 25, 50];
const DEFAULT_ROWS_PER_PAGE = 50;

export default function ScriptLogs({ flowId, scriptId }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_ROWS_PER_PAGE);
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [enqueueSnackbar] = useEnqueueSnackbar();

  const {
    logs = emptySet,
    resourceReferences, dateRange,
    selectedResources,
    functionType,
    logLevel,
    nextPageURL,
    status,
    fetchStatus,
    currQueryTime,
  } = useSelector(state => selectors.scriptLog(state, {scriptId, flowId}), shallowEqual);
  const isAllLogsReceived = useSelector(state => selectors.isAllLogsReceived(state, {scriptId, flowId}));
  const isPurgeAvailable = useSelector(state => selectors.isPurgeAvailable(state, {scriptId, flowId}));
  const isPurgeLogSuccess = useSelector(state => selectors.isPurgeLogSuccess(state));
  const useRowActions = () => [PurgeLog];

  const patchFilter = useCallback((field, value) => {
    dispatch(actions.logs.scripts.patchFilter({scriptId, flowId, field, value}));
  }, [dispatch, flowId, scriptId]);
  const handleChangeRowsPerPage = useCallback(event => {
    setRowsPerPage(parseInt(event.target.value, 10));
  }, []);
  const handleChangePage = useCallback(
    (event, newPage) => setPage(newPage),
    []
  );
  const handleDateRangeChange = useCallback(range => {
    patchFilter('dateRange', getSelectedRange(range, true));
  }, [patchFilter]);
  const handleSelectedResourceChange = useCallback(val => {
    patchFilter('selectedResources', val);
  }, [patchFilter]);
  const handleFunctionTypeChange = useCallback(val => {
    patchFilter('functionType', val.target.value);
  }, [patchFilter]);

  const loadMoreLogs = useCallback(
    () => {
      dispatch(actions.logs.scripts.loadMore({scriptId, flowId, fetchNextPage: true}));
    },
    [dispatch, flowId, scriptId],
  );
  const functionTypes = flowId ? SCRIPT_FUNCTION_TYPES_FOR_FLOW : SCRIPT_FUNCTION_TYPES;
  const paginationOptions = useMemo(
    () => ({
      loadMoreHandler: loadMoreLogs,
      hasMore: !!nextPageURL,
      loading: status === 'requested',

    }),
    [loadMoreLogs, nextPageURL, status]
  );

  const handleRefreshClick = useCallback(
    () => {
      dispatch(actions.logs.scripts.refresh({scriptId, flowId}));
    },
    [dispatch, flowId, scriptId],
  );
  const handleLogLevelChange = useCallback(
    val => {
      patchFilter('logLevel', val.target.value);
    },
    [patchFilter],
  );

  const actionProps = useMemo(() => ({
    scriptId,
    flowId,
  }), [flowId, scriptId]);

  const logsInCurrentPage = useMemo(
    () => logs.slice(page * rowsPerPage, (page + 1) * rowsPerPage).map(l => ({key: `${l.index}`, ...l})),
    [page, rowsPerPage, logs]
  );

  useEffect(() => {
    if (status === undefined) {
      dispatch(actions.logs.scripts.request({scriptId, flowId, isInit: true}));
    }
  }, [dispatch, flowId, scriptId, status]);

  /*
  To disable/enable the purge action, UI needs information if the respective script has any logs present
  If there are no logs present for the default selected time period, we make a call to get all the logs for a given script
  */
  useEffect(() => {
    if (!logs.length && !isAllLogsReceived) {
      dispatch(actions.logs.scripts.requestAllLogs({scriptId, flowId}));
    }
  }, [dispatch, flowId, isAllLogsReceived, logs?.length, scriptId]);

  /*
  If the purge is a success, we need to refresh the list if there are any logs present in the selected time frame.
  */
  useEffect(() => {
    if (isPurgeLogSuccess) {
      if (logs.length) {
        dispatch(actions.logs.scripts.refresh({scriptId, flowId}));
      }
      enqueueSnackbar({
        message: message.PURGE.SCRIPT_LOG_SUCCESS_MESSAGE,
        variant: 'success',
      });
      dispatch(actions.logs.scripts.purge.clear());
    }
  }, [dispatch, enqueueSnackbar, flowId, isPurgeLogSuccess, logs.length, scriptId]);

  // used to determine fetch progress percentage
  const {startTime, endTime} = useMemo(() => {
    const {startDate, endDate} = dateRange || {};

    return {
      startTime: startDate ? startDate.getTime() : addMinutes(new Date(), -15).getTime(),
      endTime: endDate ? endDate.getTime() : null,
    };
  }, [dateRange]);

  const pauseHandler = useCallback(() => {
    dispatch(actions.logs.scripts.setFetchStatus({scriptId, flowId, fetchStatus: 'paused'}));
    dispatch(actions.logs.scripts.pauseFetch({scriptId, flowId}));
  }, [dispatch, flowId, scriptId]);

  const resumeHandler = useCallback(() => {
    dispatch(actions.logs.scripts.loadMore({scriptId, flowId, fetchNextPage: true}));
  }, [dispatch, flowId, scriptId]);

  return (
    <div className={classes.root}>
      <div className={classes.filterContainer}>
        <div className={classes.leftActionContainer}>
          <DateRangeSelector
            value={dateRange || defaultRange}
            clearable
            placement="right"
            customPresets={rangeFilters}
            clearValue={defaultRange}
            onSave={handleDateRangeChange}
            fromDate={startOfDay(addDays(new Date(), -29))}
            showTime />
          <SelectDependentResource
            selectedResources={selectedResources}
            resources={resourceReferences}
            onSave={handleSelectedResourceChange}
            />
          <CeligoSelect
            data-test="selectFunctionType"
            className={classes.filterButton}
            onChange={handleFunctionTypeChange}
            displayEmpty
            value={functionType || ''}>
            <MenuItem value="">Function type</MenuItem>
            {Object.values(functionTypes).map(functionValue => (
              <MenuItem key={functionValue} value={functionValue}>
                {functionValue}
              </MenuItem>
            ))}
          </CeligoSelect>
          <CeligoSelect
            data-test="selectLogLevel"
            className={classes.filterButton}
            onChange={handleLogLevelChange}
            displayEmpty
            value={logLevel || ''}>
            <MenuItem value="">Log level</MenuItem>
            {Object.keys(LOG_LEVELS).map(logLevel => (
              <MenuItem key={logLevel} value={logLevel} >
                {LOG_LEVELS[logLevel]}
              </MenuItem>
            ))}
          </CeligoSelect>
        </div>
        {selectedComponent}
        <div className={classes.rightActionContainer}>
          <div className={classes.leftActionItems}>
            {flowId && (
            <RunFlowButton
              flowId={flowId}
              variant="iconText"
            />
            )}
            <StartDebug
              resourceId={scriptId}
              resourceType="scripts"
            />
            <TextButton
              onClick={handleRefreshClick}
              data-test="refreshResource"
              disabled={status === 'requested'}
              startIcon={<RefreshIcon />}>
              Refresh
            </TextButton>
            <ActionMenu
              iconLabel="More"
              setSelectedComponent={setSelectedComponent}
              useRowActions={useRowActions}
              rowData={{
                scriptId,
                flowId,
                isPurgeAvailable,
              }}
            />
          </div>
          <CeligoPagination
            {...paginationOptions}
            rowsPerPageOptions={rowsPerPageOptions}
            className={classes.tablePaginationRoot}
            count={logs.length}
            page={page}
            rowsPerPage={rowsPerPage}
            resultPerPageLabel="Rows:"
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
          />
        </div>
      </div>
      <div className={classes.tableContainer}>

        <FetchProgressIndicator
          className={classes.scriptsFetchLog}
          fetchStatus={fetchStatus}
          currTime={currQueryTime}
          startTime={startTime}
          endTime={endTime}
          pauseHandler={pauseHandler}
          resumeHandler={resumeHandler} />

        {logs?.length ? (
          <CeligoTable
            data={logsInCurrentPage}
            {...metadata}
            actionProps={actionProps}
        />
        ) : null}
        {!logs.length && !nextPageURL && status !== 'requested' && (
          <NoResultTypography isBackground>
            {messageStore('NO_RESULT', {message: 'execution logs in the selected time frame'})}
          </NoResultTypography>
        )}
        {!logs.length && !!nextPageURL && fetchStatus === 'inProgress' && (
          <Spinner center="horizontal" size="large" sx={{mt: 1}} />
        )}
      </div>
      <ViewLogDetailDrawer />
    </div>
  );
}
