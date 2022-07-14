import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AuditLog from '../../components/AuditLog';
import PanelHeader from '../../components/PanelHeader';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.common.white,
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
    overflowX: 'auto',
    minHeight: 124,
    marginBottom: theme.spacing(12),
  },
}));

const infoTextAuditLog =
'Audit logs maintain a record of certain activities in your flows, including the fields that were changed, the type of change, and who’s responsible for the change. <a href="https://docs.celigo.com/hc/en-us/articles/6514515710107-Manage-your-audit-logs">Learn more about audit logs</a>.';
export default function Audit() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <PanelHeader title="Audit log" infoText={infoTextAuditLog} />
      <AuditLog />
    </div>
  );
}
