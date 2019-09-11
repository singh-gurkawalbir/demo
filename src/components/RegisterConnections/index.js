import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import actions from '../../actions';
import LoadResources from '../../components/LoadResources';
import ResourceTable from '../../views/ResourceList/ResourceTable';
import * as selectors from '../../reducers';

const useStyles = makeStyles(theme => ({
  title: {
    marginLeft: theme.spacing(4),
    padding: theme.spacing(2),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
  },
}));

export default function RegisterConnections(props) {
  const {
    title = 'Register Connections',
    onClose,
    integrationId,
    resourceType = 'connections',
    metadataType = 'registerConnections',
  } = props;
  const classes = useStyles();
  const connectionsToReg = useSelector(state =>
    selectors.getAvailableConnectionsToRegister(
      state,
      resourceType,
      integrationId
    )
  );
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
      <DialogContent>
        <LoadResources required resources={resourceType}>
          <ResourceTable
            resources={connectionsToReg}
            selectResourceRef={selectedConnections}
            metadataType={metadataType}
            isSelectableListing
          />
        </LoadResources>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleRegisterClick}>Register</Button>
      </DialogActions>
    </Dialog>
  );
}
