import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    alignSelf: 'center',
    marginTop: theme.spacing(7),
    marginRight: -theme.spacing(3),
  },
  dottedLine: {
    marginTop: -theme.spacing(3),
    borderBottom: `3px dotted ${theme.palette.divider}`,
  },
}));

export default function LeftActions({ children }) {
  const classes = useStyles();

  return (
    <div>
      <div className={classes.root}>{children}</div>
      <div className={classes.dottedLine} />
    </div>
  );
}
