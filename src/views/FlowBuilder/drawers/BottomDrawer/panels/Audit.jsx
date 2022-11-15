import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AuditLog from '../../../../../components/AuditLog';

const useStyles = makeStyles(theme => ({
  auditLog: {
    marginTop: -1,
    '& > div': {
      '&:first-child': {
        backgroundColor: theme.palette.common.white,
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
