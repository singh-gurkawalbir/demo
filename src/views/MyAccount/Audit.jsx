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
  },
}));

export default function Audit() {
  const classes = useStyles();

  return (
    <>
      <div className={classes.root}>
        <PanelHeader title="Audit Log" />
        <AuditLog />
      </div>
    </>
  );
}
