import { Typography, makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(2),
    display: 'flex',
    justifyContent: 'space-between',
  },
  action: {},
}));

export default function PanelHeader({ title, children }) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Typography variant="h3">{title}</Typography>
      <div className={classes.action}>{children}</div>
    </div>
  );
}
