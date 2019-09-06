import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles(theme => ({
  wrapper: {
    color: theme.palette.text.primary,
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 5,
  },
}));

function FooterActions(props) {
  const classes = useStyles();
  const { children } = props;

  return <div className={classes.wrapper}>{children}</div>;
}

export default FooterActions;
