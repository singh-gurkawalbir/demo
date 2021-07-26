import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { makeStyles } from '@material-ui/styles';
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

export default function AuditPanel({ flowId }) {
  const classes = useStyles();

  return (
    <AuditLog
      resourceType="flows"
      resourceId={flowId}
      className={classes.auditLog}
      />
  );
}
