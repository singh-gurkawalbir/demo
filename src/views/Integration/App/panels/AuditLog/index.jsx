import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import AuditLog from '../../../../../components/AuditLog';
import PanelHeader from '../../../../../components/PanelHeader';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    overflow: 'auto',
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
    paddingBottom: theme.spacing(1),
    minHeight: 124,
  },
}));

export default function AuditLogSection({ integrationId, childId }) {
  const classes = useStyles();
  const infoTextAuditLog =
    'Keep track of changes to your flow, enabling you to track down problems based on changes to your flows. Know exactly who made the change, what the change was, and when it happened.';

  return (
    <div className={classes.root}>
      <PanelHeader title="Audit log" infoText={infoTextAuditLog} />

      <AuditLog
        resourceType="integrations"
        resourceId={integrationId}
        integrationId={integrationId}
        childId={childId}
      />
    </div>
  );
}
