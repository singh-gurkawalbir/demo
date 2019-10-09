import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles(theme => ({
  wrapper: {
    color: theme.palette.text.primary,
    display: 'flex',
    justifyContent: 'flex-start',
    flexDirection: 'column',
    position: 'absolute',
    bottom: '22px',
    left: '22px',
    right: '22px',
  },
}));

function Footer(props) {
  const classes = useStyles();
  const { children } = props;

  return <div className={classes.wrapper}>{children}</div>;
}

export default Footer;
