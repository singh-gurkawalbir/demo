import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';
import * as selectors from '../../reducers';
import StatusCircle from '../StatusCircle';

const useStyles = makeStyles({
  agentStatusWrapper: {
    display: 'flex',
    alignItems: 'center',
  },
});

export default function AgentStatus({ agentId }) {
  const classes = useStyles();
  const agentOnline = useSelector(state =>
    selectors.isAgentOnline(state, agentId)
  );

  return (
    <div className={classes.agentStatusWrapper}>
      <StatusCircle size="small" variant={agentOnline ? 'success' : 'error'} />
      {agentOnline ? 'Online' : 'Offline'}
    </div>
  );
}
