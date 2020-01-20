import { Typography, makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(2),
    display: 'flex',
    justifyContent: 'space-between',
  },
}));

export default function PanelHeader({ title, children }) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Typography variant="h4">{title}</Typography>
      <div>{children}</div>
    </div>
  );
}
