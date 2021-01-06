import React, { useMemo, useState, useCallback, useEffect } from 'react';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import { makeStyles, MenuItem } from '@material-ui/core';
import { addDays, addMinutes, startOfDay } from 'date-fns';
import { selectors } from '../../reducers';
import actions from '../../actions';
import DateRangeSelector from '../DateRangeSelector';
import CeligoSelect from '../CeligoSelect';
import RunFlowButton from '../RunFlowButton';
import StartDebug from '../StartDebug';
import IconTextButton from '../IconTextButton';
import RefreshIcon from '../icons/RefreshIcon';
import CeligoPagination from '../CeligoPagination';
import CeligoTable from '../CeligoTable';
import metadata from './metadata';
import { getSelectedRange } from '../../utils/flowMetrics';
import SelectDependentResource from '../SelectDependentResource';
import { LOG_LEVELS, SCRIPT_FUNCTION_TYPES } from '../../utils/script';
import Spinner from '../Spinner';
import SearchIcon from '../icons/SearchIcon';
import ViewLogDetailDrawer from './metadata/actions/LogDetailDrawer';

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: -1,
    padding: theme.spacing(0, 0, 1.5, 2),
    backgroundColor: theme.palette.common.white,
    height: '100%',
  },
  filterContainer: {
    display: 'flex',
    justifyContent: 'space-between',

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
    // flexGrow: 1,
    // display: 'flex',
    // justifyContent: 'flex-end',
    // alignContent: 'center',
  },
  leftActionContainer: {
    padding: theme.spacing(2, 0),
    // border: `solid 1px ${theme.palette.secondary.lightest}`,
    // borderWidth: [[1, 0]],
    display: 'flex',
    flexWrap: 'wrap',
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
  {id: 'today', label: 'Today'},
  {id: 'last30minutes', label: 'Last 30 minutes'},
  {id: 'yesterday', label: 'Yesterday'},
  {id: 'last1hour', label: 'Last hour'},
  {id: 'last7days', label: 'Last 7 Days'},
  {id: 'last4hours', label: 'Last 4 hours'},
  {id: 'custom', label: 'Custom'},
  {id: 'last24hours', label: 'Last 24 hours'},
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
  const [isInitTriggered, setIsInitTriggered] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_ROWS_PER_PAGE);

  const {
    logs: scriptExecutionLogs = emptySet,
    resourceReferences, dateRange,
    selectedResources,
    functionType,
    logLevel,
    nextPageURL,
    status,
  } = useSelector(state => selectors.scriptLog(state, {scriptId, flowId}), shallowEqual);

  const patchFilter = useCallback((field, value) => {
    dispatch(actions.logs.script.patchFilter({scriptId, flowId, field, value}));
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
      dispatch(actions.logs.script.loadMore({scriptId, flowId}));
    },
    [dispatch, flowId, scriptId],
  );
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
      dispatch(actions.logs.script.refreshLogs({scriptId, flowId}));
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
    () => scriptExecutionLogs.slice(page * rowsPerPage, (page + 1) * rowsPerPage),
    [page, rowsPerPage, scriptExecutionLogs]
  );

  useEffect(() => {
    if (isInitTriggered) {
      dispatch(actions.logs.script.requestLogs({scriptId, flowId}));
      setIsInitTriggered(true);
    }

    // return () => {
    //   console.log('clear triggered');
    //   dispatch(actions.logs.script.clear({scriptId, flowId}));
    // };
  }, [dispatch, scriptId, flowId, isInitTriggered]);

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
            showTime={false} />
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
            <MenuItem value="">Select function type</MenuItem>
            {Object.keys(SCRIPT_FUNCTION_TYPES).map(functionType => (
              <MenuItem key={SCRIPT_FUNCTION_TYPES[functionType]} value={SCRIPT_FUNCTION_TYPES[functionType]}>
                {SCRIPT_FUNCTION_TYPES[functionType]}
              </MenuItem>

            ))}
          </CeligoSelect>
          <CeligoSelect
            data-test="selectLogLevel"
            className={classes.filterButton}
            onChange={handleLogLevelChange}
            displayEmpty
            value={logLevel || ''}>
            <MenuItem value="">Select log level</MenuItem>
            {Object.keys(LOG_LEVELS).map(logLevel => (
              <MenuItem key={logLevel} value={logLevel}>
                {logLevel}
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
            data-test="refreshResource">
            <RefreshIcon />
            Refesh
          </IconTextButton>
          <CeligoPagination
            {...paginationOptions}
            rowsPerPageOptions={rowsPerPageOptions}
            className={classes.tablePaginationRoot}
            // count={errorObj.errors.length}
            count={scriptExecutionLogs.length}
            page={page}
            rowsPerPage={rowsPerPage}
            resultPerPageLabel="Rows:"
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
          />
        </div>
      </div>
      <div className={classes.container}>
        {scriptExecutionLogs?.length ? (
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
