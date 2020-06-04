import React from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import AuditLog from './Actions/AuditLog';
import Debugger from './Actions/Debugger';
import References from './Actions/References';
import RightDrawer from '../drawer/Right';
import { flowConnections } from '../../reducers';
import ConnectionRow from './Components/ConnectionRow';

const useStyles = makeStyles(() => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
  },
}));

export default function FlowConnections({ flowId, integrationId }) {
  const classes = useStyles();
  const connections = useSelector(
    state => flowConnections(state, flowId),
    shallowEqual
  );

  return (
    <>
      <div className={classes.container}>
        {connections.map(connection => (
          <ConnectionRow
            connection={connection}
            key={connection._id}
            flowId={flowId}
            integrationId={integrationId}
          />
        ))}
      </div>

      <RightDrawer
        path=":connectionId/auditlog"
        width="medium"
        title="Connection Audit log">
        <AuditLog flowId={flowId} integrationId={integrationId} />
      </RightDrawer>
      <RightDrawer
        path=":connectionId/debugger"
        width="medium"
        title="Connection Debugger">
        <Debugger />
      </RightDrawer>
      <RightDrawer
        path=":connectionId/references"
        width="medium"
        title="Connection Debugger">
        <References />
      </RightDrawer>
    </>
  );
}
