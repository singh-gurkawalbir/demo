import { Fragment } from 'react';
import AuditLog from '../../../../../../components/AuditLog';
import PanelHeader from '../../../../../../components/PanelHeader';

export default function AuditLogSection({ integrationId }) {
  const infoTextUsers =
    'Keep track of changes to your integration, enabling you to track down problems based on changes to your integration or its flows. Know exactly who made the change, what the change was, and when it happened.';

  return (
    <Fragment>
      <PanelHeader title="Audit log" infoText={infoTextUsers} />

      <AuditLog resourceType="integrations" resourceId={integrationId} />
    </Fragment>
  );
}
