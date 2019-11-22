import { Fragment } from 'react';
// import { Typography } from '@material-ui/core';
import AuditLog from '../../../../../../components/AuditLog';
import PanelHeader from '../../../../common/PanelHeader';

export default function AuditLogSection({ integrationId }) {
  return (
    <Fragment>
      <PanelHeader title="Audit log" />

      <AuditLog resourceType="integrations" resourceId={integrationId} />
    </Fragment>
  );
}
