import { Fragment } from 'react';
import AuditLog from '../../../../../../components/AuditLog';
import PanelHeader from '../../../../../../components/PanelHeader';

export default function AuditLogSection({ integrationId }) {
  const infoTextAuditLog =
    'Keep track of changes to your flow, enabling you to track down problems based on changes to your flows. Know exactly who made the change, what the change was, and when it happened.';

  return (
    <Fragment>
      <PanelHeader title="Audit log" infoText={infoTextAuditLog} />

      <AuditLog resourceType="integrations" resourceId={integrationId} />
    </Fragment>
  );
}
