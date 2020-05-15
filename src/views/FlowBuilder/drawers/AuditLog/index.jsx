import RightDrawer from '../../../../components/drawer/Right';
import FlowAuditLog from '../../../../components/FlowAuditLog';

export default function AuditLogDrawer({ flowId }) {
  return (
    <RightDrawer path="auditlog" width="medium" title="Flow audit log">
      <FlowAuditLog resourceType="flows" resourceId={flowId} />
    </RightDrawer>
  );
}
