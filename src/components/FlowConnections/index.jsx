import { Fragment, useCallback } from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import { useHistory, useRouteMatch } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import AuditLog from './Actions/AuditLog';
import Debugger from './Actions/Debugger';
import RightDrawer from '../drawer/Right';
import { flowConnections } from '../../reducers';

export default function FlowConnections({ flowId }) {
  const history = useHistory();
  const match = useRouteMatch();
  const handleAuditLog = useCallback(
    connectionId => () => {
      history.push(`${match.url}/${connectionId}/auditlog`);
    },
    [history, match.url]
  );
  const handleDebugger = connectionId => () => {
    history.push(`${match.url}/${connectionId}/debugger`);
  };

  const connections = useSelector(
    state => flowConnections(state, flowId),
    shallowEqual
  );

  return (
    <Fragment>
      <div>Connections </div>
      {connections.map(connection => (
        <div key={connection._id}>
          Name : {connection.name} , auditLog:
          <Button onClick={handleAuditLog(connection._id)}> Click </Button>,
          debugger:{' '}
          <Button onClick={handleDebugger(connection._id)}> Click </Button>
        </div>
      ))}

      <RightDrawer
        path=":connectionId/auditlog"
        width="medium"
        title="Connection Audit log">
        <AuditLog />
      </RightDrawer>
      <RightDrawer
        path=":connectionId/debugger"
        width="medium"
        title="Connection Debugger">
        <Debugger />
      </RightDrawer>
    </Fragment>
  );
}
