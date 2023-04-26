import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import AuditLog from '../../../../../components/AuditLog';

const useStyles = makeStyles(theme => ({
  auditLog: {
    marginTop: -1,
    '& > div': {
      '&:first-child': {
        backgroundColor: theme.palette.background.paper,
      },
    },
  },
}));

export default function AuditPanel({ flowId, integrationId }) {
  const classes = useStyles();

  return (
    <AuditLog
      resourceType="flows"
      integrationId={integrationId}
      resourceId={flowId}
      className={classes.auditLog}
      />
  );
}
