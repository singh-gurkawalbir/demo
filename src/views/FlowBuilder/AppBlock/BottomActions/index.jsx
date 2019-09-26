import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  root: {
    // height: theme.spacing(6),
    display: 'flex',
    alignSelf: 'center',
    marginTop: theme.spacing(-1),
  },
}));

export default function BottomActions({ children }) {
  const classes = useStyles();

  return <div className={classes.root}>{children}</div>;
}
