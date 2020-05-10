import { useRouteMatch } from 'react-router-dom';

export default function AuditLog({ flowId }) {
  const match = useRouteMatch();
  const { connectionId } = match.params;

  return (
    <div>
      Connections audit log {flowId} {connectionId}
    </div>
  );
}
