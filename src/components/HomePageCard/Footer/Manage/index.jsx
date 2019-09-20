import { makeStyles } from '@material-ui/styles';
import IconButton from '@material-ui/core/IconButton';

const useStyles = makeStyles(theme => ({
  wrapper: {
    color: theme.palette.text.primary,
    marginRight: 10,
    padding: 7,
    '&:hover': {
      background: theme.palette.background.default,
    },
  },
}));

function Manage(props) {
  const classes = useStyles();
  const { children } = props;

  return (
    <IconButton aria-label="manage" className={classes.wrapper} {...props}>
      {children}
    </IconButton>
  );
}

export default Manage;
