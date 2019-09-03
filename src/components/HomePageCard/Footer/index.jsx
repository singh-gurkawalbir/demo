import { makeStyles } from '@material-ui/styles';

const usestyles = makeStyles(theme => ({
  wrapper: {
    color: theme.palette.text.primary,
    display: 'flex',
    justifyContent: 'flex-start',
    flexDirection: 'column',
  },
}));

function Footer(props) {
  const classes = usestyles();
  const { children } = props;

  return <div className={classes.wrapper}>{children}</div>;
}

export default Footer;
