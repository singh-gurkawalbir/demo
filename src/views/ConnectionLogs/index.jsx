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
import CodePanel from '../../components/AFE/GenericEditor';

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
    height: '100%',
    width: '100%',
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
      dispatch(actions.logs.connections.refresh(connectionId));
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
            data-test="refreshResource">
            <RefreshIcon />
            Refresh
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
