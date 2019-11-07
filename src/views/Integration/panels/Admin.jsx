import { makeStyles } from '@material-ui/styles';
import { Typography } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(0),
  },
}));

export default function AdminPanel({ integrationId }) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Typography>Admin Panel {integrationId}</Typography>
    </div>
  );
}
