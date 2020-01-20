import { Fragment } from 'react';
import AuditLog from '../../../../../../components/AuditLog';
import PanelHeader from '../../../../../../components/PanelHeader';

export default function AuditLogSection({ integrationId }) {
  return (
    <Fragment>
      <PanelHeader title="Audit log" />

      <AuditLog resourceType="integrations" resourceId={integrationId} />
    </Fragment>
  );
}
