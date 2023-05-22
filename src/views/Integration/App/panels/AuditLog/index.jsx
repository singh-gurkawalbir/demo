import React from 'react';
import { Box } from '@mui/material';
import AuditLog from '../../../../../components/AuditLog';
import PanelHeader from '../../../../../components/PanelHeader';

export default function AuditLogSection({ integrationId, childId }) {
  const infoTextAuditLog =
    'Keep track of changes to your flow, enabling you to track down problems based on changes to your flows. Know exactly who made the change, what the change was, and when it happened.';

  return (
    <Box
      sx={{
        backgroundColor: theme => theme.palette.background.paper,
        overflow: 'auto',
        border: '1px solid',
        borderColor: theme => theme.palette.secondary.lightest,
        paddingBottom: theme => theme.spacing(1),
        minHeight: 124,
      }}>
      <PanelHeader title="Audit log" infoText={infoTextAuditLog} />

      <AuditLog
        resourceType="integrations"
        resourceId={integrationId}
        integrationId={integrationId}
        childId={childId}
      />
    </Box>
  );
}
