import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import AuditLog from '../../components/AuditLog';
import PanelHeader from '../../components/PanelHeader';
import infoText from '../../components/Help/infoText';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
    overflowX: 'auto',
    minHeight: 124,
    marginBottom: theme.spacing(12),
  },
}));

export default function Audit() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <PanelHeader title="Audit log" infoText={infoText.AuditLog} />
      <AuditLog />
    </div>
  );
}
