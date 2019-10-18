import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3),
  },
}));

export default function RunDashboardPanel() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Typography variant="h3">Run Dashboard panel coming soon!</Typography>
    </div>
  );
}
