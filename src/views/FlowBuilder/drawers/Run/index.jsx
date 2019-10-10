import { Typography, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import RightDrawer from '../RightDrawer';

const useStyles = makeStyles(theme => ({
  titleBar: {
    display: 'flex',
    marginBottom: theme.spacing(3),
  },
  title: {
    flexGrow: 1,
  },
}));

export default function RunDrawer({ flowId, ...props }) {
  const handleClose = () => props.history.goBack();
  const classes = useStyles();

  return (
    <RightDrawer {...props} path="run">
      <div className={classes.titleBar}>
        <Typography variant="h5" className={classes.title}>
          Run
        </Typography>
        <Button onClick={handleClose} color="secondary">
          Cancel
        </Button>
        <Button variant="contained" color="primary">
          Run flow
        </Button>
      </div>
      For flow: {flowId}
    </RightDrawer>
  );
}
