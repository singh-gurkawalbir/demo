import React, { useEffect, useCallback } from 'react';
import moment from 'moment';
import { useRouteMatch } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import actions from '../../../../actions';
import { debugLogs } from '../../../../reducers';
import CodePanel from '../../../AFE/GenericEditor/CodePanel';
import RefreshIcon from '../../../icons/RefreshIcon';
import IconTextButton from '../../../IconTextButton';
import Spinner from '../../../Spinner';

const useStyles = makeStyles(() => ({
  refresh: {
    height: ' 50px',
  },
  refreshButton: {
    float: 'right',
  },
  container: {
    width: '600px',
    height: '400px',
  },
}));

export default function Debugger() {
  const dispatch = useDispatch();
  const match = useRouteMatch();
  const classes = useStyles();
  const { connectionId } = match.params;
  const connectionDebugLogs = useSelector(state => {
    const connectionLogs = debugLogs(state) || {};

    return connectionLogs[connectionId];
  });
  const requestConnectionDebug = useCallback(() => {
    dispatch(actions.connection.clearDebugLogs(connectionId));
    dispatch(actions.connection.requestDebugLogs(connectionId));

    dispatch(
      actions.resource.patch('connections', connectionId, [
        {
          op: 'replace',
          path: '/debugDate',
          value: moment()
            .add(60, 'm')
            .toISOString(),
        },
      ])
    );
  }, [connectionId, dispatch]);

  useEffect(() => {
    requestConnectionDebug();

    return () => dispatch(actions.connection.clearDebugLogs(connectionId));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <div className={classes.refresh}>
        <IconTextButton
          className={classes.refreshButton}
          onClick={requestConnectionDebug}>
          <RefreshIcon /> Refresh
        </IconTextButton>
      </div>
      <div className={classes.container}>
        {connectionDebugLogs ? (
          <CodePanel
            name="code"
            readOnly
            value={connectionDebugLogs}
            mode="javascript"
            overrides={{ useWorker: false }}
          />
        ) : (
          <Spinner />
        )}
      </div>
    </div>
  );
}
