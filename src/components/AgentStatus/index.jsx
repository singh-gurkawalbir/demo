import { useSelector } from 'react-redux';
import * as selectors from '../../reducers';
import StatusCircle from '../../components/StatusCircle';

export default function AgentStatus({ agentId }) {
  const agentOnline = useSelector(state =>
    selectors.isAgentOnline(state, agentId)
  );

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <StatusCircle size="small" variant={agentOnline ? 'success' : 'error'} />
      {agentOnline ? 'Online' : 'Offline'}
    </div>
  );
}
