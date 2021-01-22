import React, { useCallback, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core';
import moment from 'moment';
import shallowEqual from 'react-redux/lib/utils/shallowEqual';
import { selectors } from '../../reducers';
import actions from '../../actions';
import RunFlowButton from '../../components/RunFlowButton';
import StartDebug from '../../components/StartDebug';
import IconTextButton from '../../components/IconTextButton';
import CancelIcon from '../../components/icons/CancelIcon';
import RefreshIcon from '../../components/icons/RefreshIcon';
import DownloadDebugLogs from './DownloadDebugLogs';
import AutoScrollEditorTerminal from '../../components/AutoScrollEditorTerminal';
import { COMM_STATES } from '../../reducers/comms/networkComms';

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
    position: 'sticky',
    justifyContent: 'space-between',
    background: theme.palette.background.default,
    marginLeft: theme.spacing(-2),
    borderBottom: `1px solid ${theme.palette.secondary.lightest}`,
  },
  rightActionContainer: {
    padding: theme.spacing(2, 0),
    // flexGrow: 1,
    display: 'flex',
    // justifyContent: 'flex-end',
    alignContent: 'center',
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
    width: '100%',
    height: 'calc(100% - 63px)',
    overflowY: 'auto',

  },
}));

const emptyObj = {};
const emptyLogMessage = 'There are no logs available for this connection. Please run your flow so that we can record the outgoing and incoming traffic to this connection';
export default function ConnectionLogs({ connectionId, flowId }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [isInitTriggered, setIsInitTriggered] = useState(false);
  const {logs, status} = useSelector(state => selectors.allConnectionsLogs(state)?.[connectionId] || emptyObj, shallowEqual);
  const isDebugActive = useSelector(state => {
    const {debugDate} = selectors.resource(state, 'connections', connectionId);

    return !!(debugDate && moment().isBefore(moment(debugDate)));
  });
  const handleDeleteLogsClick = useCallback(
    () => {
      dispatch(actions.logs.connections.delete(connectionId));
    },
    [dispatch, connectionId],
  );

  const handleRefreshClick = useCallback(
    () => {
      dispatch(actions.logs.connections.request(connectionId));
    },
    [dispatch, connectionId],
  );

  const startAutoDebug = useCallback(() => {
    dispatch(actions.logs.connections.startDebug(connectionId, 15));
  }, [connectionId, dispatch]);

  useEffect(() => {
    if (!isInitTriggered) {
      // check if debug is already set on connection. If not start debug for 15 mins.
      if (!isDebugActive) {
        // trigger start debug
        startAutoDebug();
      }
      setIsInitTriggered(true);
    }
  }, [isDebugActive, isInitTriggered, startAutoDebug]);

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
            disabled={!logs}
          />
          {flowId && (
            <RunFlowButton
              flowId={flowId}
              variant="iconText"
            />
          )}
          <IconTextButton
            onClick={handleRefreshClick}
            data-test="refreshResource"
            disabled={status === COMM_STATES.LOADING}>
            <RefreshIcon />
            Refresh
          </IconTextButton>
          <IconTextButton
            onClick={handleDeleteLogsClick}
            data-test="clearLogs"
            disabled={status === COMM_STATES.LOADING}>
            <CancelIcon />
            Clear
          </IconTextButton>
        </div>
      </div>
      <div className={classes.editorContainer}>
        {[COMM_STATES.SUCCESS, COMM_STATES.ERROR].includes(status) && (
          <AutoScrollEditorTerminal
            name="code"
            readOnly
            value={logs || emptyLogMessage}
            mode="text"
            overrides={overrides}
        />
        )}
      </div>
    </div>
  );
}
