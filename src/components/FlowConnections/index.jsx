import { Fragment, useCallback } from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import { useHistory, useRouteMatch } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import AuditLog from './AuditLog';
import RightDrawer from '../drawer/Right';
import { flowConnections } from '../../reducers';

export default function FlowConnections({ flowId }) {
  const history = useHistory();
  const match = useRouteMatch();
  const handleClick = useCallback(
    connectionId => () => {
      history.push(`${match.url}/${connectionId}/auditlog`);
    },
    [history, match.url]
  );
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
          <Button onClick={handleClick(connection._id)}> Click </Button>
        </div>
      ))}

      <RightDrawer
        path=":connectionId/auditlog"
        width="medium"
        title="Flow Audit log">
        <AuditLog />
      </RightDrawer>
    </Fragment>
  );
}
