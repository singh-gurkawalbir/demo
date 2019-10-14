import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3),
  },
}));

export default function AuditPanel() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Typography variant="h3">Audit Log panel coming soon!</Typography>
    </div>
  );
}
