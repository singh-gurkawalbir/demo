import React, { useCallback, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core';
import moment from 'moment';
import shallowEqual from 'react-redux/lib/utils/shallowEqual';
import { selectors } from '../../reducers';
import actions from '../../actions';
import RunFlowButton from '../RunFlowButton';
import StartDebug from '../StartDebug';
import IconTextButton from '../IconTextButton';
import CancelIcon from '../icons/CancelIcon';
import RefreshIcon from '../icons/RefreshIcon';
import CodePanel from '../AFE/GenericEditor/CodePanel';
import DownloadDebugLogs from './DownloadDebugLogs';

const overrides = { useWorker: false };

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
  editorContainer: {
    height: '100%',
    width: '100%',
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

const emptyObj = {};
const emptyLogMessage = 'There are no logs available for this connection. Please run your flow so that we can record the outgoing and incoming traffic to this connection';
export default function ConnectionLogs({ connectionId, flowId }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [isInitTriggered, setIsInitTriggered] = useState(false);
  const {logs, status} = useSelector(state => {
    const allConnectionDebugLogs = selectors.allConnectionsLogs(state);

    return allConnectionDebugLogs?.[connectionId] || emptyObj;
  }, shallowEqual);

  const debugMinutesPending = useSelector(state => {
    const {debugDate} = selectors.resource(state, 'connections', connectionId);

    if (!debugDate || moment().isAfter(moment(debugDate))) {
      return 0;
    }

    return moment(debugDate).diff(moment(), 'minutes');
  });
  const handleDeleteLogsClick = useCallback(
    () => {
      dispatch(actions.logs.connections.delete(connectionId));
    },
    [dispatch, connectionId],
  );

  const handleRefreshClick = useCallback(
    () => {
      dispatch(actions.logs.connections.refresh(connectionId));
    },
    [dispatch, connectionId],
  );

  const startAutoDebug = useCallback(() => {
    const patchSet = [
      {
        op: debugMinutesPending !== '0' ? 'replace' : 'remove',
        path: '/debugDate',
        value: moment().add('15', 'm').toISOString(),
      },
    ];

    dispatch(actions.resource.patch('connections', connectionId, patchSet));
  }, [connectionId, debugMinutesPending, dispatch]);

  useEffect(() => {
    if (!isInitTriggered) {
      // check if debug is already set on connection. If not start debug for 15 mins.
      if (debugMinutesPending === 0) {
        // trigger start debug
        startAutoDebug();
      }
      setIsInitTriggered(true);
    }
  }, [debugMinutesPending, isInitTriggered, startAutoDebug]);

  return (
    <div className={classes.root}>
      <div className={classes.filterContainer}>
        <div className={classes.leftActionContainer} />
        <div className={classes.rightActionContainer}>
          <StartDebug
            resourceId={connectionId}
            resourceType="connections"
            />
          <DownloadDebugLogs
            connectionId={connectionId}
          />
          {flowId && (
            <RunFlowButton
              flowId={flowId}
              variant="iconText"
            />
          )}
          <IconTextButton
            onClick={handleRefreshClick}
            data-test="refreshResource">
            <RefreshIcon />
            Refesh
          </IconTextButton>
          <IconTextButton
            onClick={handleDeleteLogsClick}
            data-test="clearLogs">
            <CancelIcon />
            Clear
          </IconTextButton>

        </div>
      </div>
      <div className={classes.editorContainer}>
        {['success', 'error'].includes(status) && (
          <CodePanel
            name="code"
            readOnly
            value={logs || emptyLogMessage}
            mode="javascript"
            overrides={overrides}
        />
        )}

      </div>
    </div>
  );
}
