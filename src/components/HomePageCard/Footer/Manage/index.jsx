import { makeStyles } from '@material-ui/styles';
import IconButton from '@material-ui/core/IconButton';

const usestyles = makeStyles(theme => ({
  wrapper: {
    color: theme.palette.text.primary,
    marginRight: 10,
    padding: 7,
    '&:hover': {
      background: theme.palette.background.editorInner,
    },
  },
}));

function Manage(props) {
  const classes = usestyles();
  const { children } = props;

  return (
    <IconButton aria-label="manage" className={classes.wrapper}>
      {children}
    </IconButton>
  );
}

export default Manage;
