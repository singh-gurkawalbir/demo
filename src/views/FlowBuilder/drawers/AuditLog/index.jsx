import RightDrawer from '../../../../components/drawer/Right';
import FlowAuditLog from '../../../../components/FlowAuditLog';

export default function AuditLogDrawer() {
  return (
    <RightDrawer path="auditlog" width="medium" title="Flow audit log">
      <FlowAuditLog />
    </RightDrawer>
  );
}
