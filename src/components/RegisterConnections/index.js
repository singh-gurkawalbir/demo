import { useState } from 'react';
import { useDispatch } from 'react-redux';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { withStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import actions from '../../actions';
import ResourceList from '../../views/ResourceList';

const styles = theme => ({
  title: {
    marginLeft: theme.spacing(4),
    padding: theme.spacing(2),
  },
  submit: {
    marginLeft: theme.spacing(4),
    marginTop: theme.spacing(4),
    marginRight: 'auto',
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
  },
  textField: {
    width: theme.spacing(50),
  },
  form: {
    marginLeft: theme.spacing(3),
  },
});

function RegisterConnections(props) {
  const {
    classes,
    title = 'Register Connections',
    width = '70vw',
    onClose,
    integrationId,
    isRegConnDialog,
  } = props;
  const [selected, setSelected] = useState({});
  const dispatch = useDispatch();
  const selectedConnections = connections => {
    setSelected(connections);
  };

  const handleRegisterClick = () => {
    const connectionIds = Object.keys(selected).filter(
      key => selected[key] === true
    );

    dispatch(
      actions.resource.registerConnections(connectionIds, integrationId)
    );
    onClose();
  };

  return (
    <Dialog open maxWidth={false}>
      <IconButton
        aria-label="Close"
        className={classes.closeButton}
        onClick={onClose}>
        <CloseIcon />
      </IconButton>
      <DialogTitle className={classes.title}>
        <Typography>{title}</Typography>
      </DialogTitle>
      <DialogContent style={{ width }}>
        <ResourceList
          resourceType="connections"
          integrationId={integrationId}
          isRegConnDialog={isRegConnDialog}
          selectedConnections={selectedConnections}
        />
      </DialogContent>
      <Button onClick={handleRegisterClick}>Register</Button>
    </Dialog>
  );
}

export default withStyles(styles)(RegisterConnections);
