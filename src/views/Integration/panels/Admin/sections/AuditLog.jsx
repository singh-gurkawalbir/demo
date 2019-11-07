import { Fragment } from 'react';
import { Typography } from '@material-ui/core';
import AuditLog from '../../../../../components/AuditLog';

export default function AuditLogSection({ integrationId }) {
  return (
    <Fragment>
      <Typography>Audit Log</Typography>

      <AuditLog resourceType="integrations" resourceId={integrationId} />
    </Fragment>
  );
}
