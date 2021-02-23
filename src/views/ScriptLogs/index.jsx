import React, { useMemo, useState, useCallback, useEffect } from 'react';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import { makeStyles, MenuItem } from '@material-ui/core';
import { addDays, addMinutes, startOfDay } from 'date-fns';
import { selectors } from '../../reducers';
import actions from '../../actions';
import DateRangeSelector from '../../components/DateRangeSelector';
import CeligoSelect from '../../components/CeligoSelect';
import RunFlowButton from '../../components/RunFlowButton';
import StartDebug from '../../components/StartDebug';
import IconTextButton from '../../components/IconTextButton';
import RefreshIcon from '../../components/icons/RefreshIcon';
import CeligoPagination from '../../components/CeligoPagination';
import CeligoTable from '../../components/CeligoTable';
import metadata from '../../components/ResourceTable/scriptLogs/metadata';
import { getSelectedRange } from '../../utils/flowMetrics';
import SelectDependentResource from '../../components/SelectDependentResource';
import { LOG_LEVELS, SCRIPT_FUNCTION_TYPES, SCRIPT_FUNCTION_TYPES_FOR_FLOW } from '../../utils/script';
import Spinner from '../../components/Spinner';
import SearchIcon from '../../components/icons/SearchIcon';
import ViewLogDetailDrawer from './DetailDrawer';

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: -1,
    padding: theme.spacing(0, 0, 1.5, 0),
    backgroundColor: theme.palette.common.white,
    height: '100%',
  },
  filterContainer: {
    display: 'flex',
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
  searchMoreWrapper: {
    textAlign: 'center',
    '& > button': {
      fontFamily: 'Roboto400',
      minWidth: 190,
      color: theme.palette.common.white,
      marginBottom: theme.spacing(2),
      marginTop: theme.spacing(2),
      padding: theme.spacing(1, 5, 1, 5),
    },
  },
  searchMoreIcon: {
    height: 18,
  },
  searchMoreSpinner: {
    marginRight: theme.spacing(1),
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
export default function ScriptLogs({ flowId, scriptId }) {
  const classes = useStyles();
  const rowsPerPageOptions = [10, 25, 50];
  const DEFAULT_ROWS_PER_PAGE = 50;
  const dispatch = useDispatch();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_ROWS_PER_PAGE);

  const {
    logs = emptySet,
    resourceReferences, dateRange,
    selectedResources,
    functionType,
    logLevel,
    nextPageURL,
    status,
  } = useSelector(state => selectors.scriptLog(state, {scriptId, flowId}), shallowEqual);

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
    patchFilter('dateRange', getSelectedRange(range));
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
        <div className={classes.rightActionContainer}>
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
          <IconTextButton
            onClick={handleRefreshClick}
            data-test="refreshResource"
            disabled={status === 'requested'}>
            <RefreshIcon />
            Refresh
          </IconTextButton>
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
        {logs?.length ? (
          <CeligoTable
            data={logsInCurrentPage}
            {...metadata}
            actionProps={actionProps}
        />
        ) : null}
        {nextPageURL && (
        <div className={classes.searchMoreWrapper}>
          <IconTextButton
            disabled={status === 'requested'}
            variant="outlined" color="primary"
            onClick={loadMoreLogs}>
            {status === 'requested' ? (
              <>
                <Spinner className={classes.searchMoreSpinner} size={18} />
                Searching
              </>
            ) : (
              <><SearchIcon className={classes.searchMoreIcon} />
                Search more
              </>
            )}
          </IconTextButton>
        </div>
        )}
      </div>
      <ViewLogDetailDrawer />
    </div>
  );
}
