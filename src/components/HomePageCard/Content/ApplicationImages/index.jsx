import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles(theme => ({
  root: {
    height: 48,
    display: 'flex',
    color: theme.palette.background.default,
    alignItems: 'center',
    maxWidth: '100%',
    overflow: 'hidden',
    marginBottom: theme.spacing(2),
    '& img': {
      maxWidth: '84px',
      maxHeight: '84px',
    },
    '& span': {
      color: theme.palette.secondary.contrastText,
      width: 24,
      height: 24,
      margin: theme.spacing(0, 1),
    },
  },
}));

function ApplicationImages(props) {
  const classes = useStyles();
  const { children } = props;

  return <div className={classes.root}>{children}</div>;
}

export default ApplicationImages;
