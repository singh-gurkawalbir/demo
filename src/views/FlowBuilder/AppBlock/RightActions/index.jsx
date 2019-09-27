import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    alignSelf: 'center',
    marginTop: theme.spacing(7),
  },
  dottedLine: {
    marginTop: -theme.spacing(3),
    // position: 'relative',
    borderBottom: `3px dotted ${theme.palette.divider}`,
  },
}));

export default function RightActions({ children }) {
  const classes = useStyles();

  return (
    <div>
      <div className={classes.root}>{children}</div>
      <div className={classes.dottedLine} />
    </div>
  );
}
