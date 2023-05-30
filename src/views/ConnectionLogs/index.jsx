import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import makeStyles from '@mui/styles/makeStyles';
import shallowEqual from 'react-redux/lib/utils/shallowEqual';
import { TextButton } from '@celigo/fuse-ui';
import { selectors } from '../../reducers';
import actions from '../../actions';
import RunFlowButton from '../../components/RunFlowButton';
import StartDebug from '../../components/StartDebug';
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
    backgroundColor: theme.palette.background.paper,
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
const EMPTY_LOG_MESSAGE = 'Run your flow to see new debug logs.';
const CONNECTION_LOG_NOT_SUPPORTED_MESSAGE = 'Debug logs not supported for this connection.';
export default function ConnectionLogs({ connectionId, flowId }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { logs, status } = useSelector(state => selectors.allConnectionsLogs(state)?.[connectionId] || emptyObj, shallowEqual);
  const isConnectionLogsNotSupported = useSelector(state => selectors.isConnectionLogsNotSupported(state, connectionId));
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

  let logsText = '';

  if (isConnectionLogsNotSupported) {
    logsText = CONNECTION_LOG_NOT_SUPPORTED_MESSAGE;
  } else if (logsText !== undefined) {
    logsText = logs || EMPTY_LOG_MESSAGE;
  }

  return (
    <div className={classes.root}>
      <div className={classes.filterContainer}>
        <div className={classes.leftActionContainer} />
        <div className={classes.rightActionContainer}>
          <StartDebug
            disabled={isConnectionLogsNotSupported}
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
          <TextButton
            onClick={handleRefreshClick}
            data-test="refreshResource"
            startIcon={<RefreshIcon />}
            disabled={status === COMM_STATES.LOADING || isConnectionLogsNotSupported}>
            Refresh
          </TextButton>
          <TextButton
            onClick={handleDeleteLogsClick}
            data-test="clearLogs"
            startIcon={<CancelIcon />}
            disabled={status === COMM_STATES.LOADING || isConnectionLogsNotSupported}>
            Clear
          </TextButton>
        </div>
      </div>
      <div className={classes.editorContainer}>
        {logsText && (
          <AutoScrollEditorTerminal
            isLoggable={false}
            name="code"
            readOnly
            value={logsText}
            mode="text"
            overrides={overrides}
        />
        )}
      </div>
    </div>
  );
}
