import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AuditLog from '../../../../../components/AuditLog';
import PanelHeader from '../../../../../components/PanelHeader';

const useStyles = makeStyles(theme => ({
  AuditLogWrapper: {
    minWidth: theme.spacing(100),
    whiteSpace: 'normal',
    wordBreak: 'break-word',
  },
  root: {
    backgroundColor: theme.palette.common.white,
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
    overflowX: 'auto',
    minHeight: 124,
  },
}));

export default function AuditLogSection({ integrationId, childId }) {
  const infoTextAuditLog =
    'Keep track of changes to your integration, enabling you to track down problems based on changes to your integration or its flows. Know exactly who made the change, what the change was, and when it happened.';
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <PanelHeader title="Audit log" infoText={infoTextAuditLog} />
      <div className={classes.AuditLogWrapper}>
        <AuditLog resourceType="integrations" resourceId={childId || integrationId} childId={childId} />
      </div>
    </div>
  );
}
