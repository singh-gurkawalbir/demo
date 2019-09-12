import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Button,
  IconButton,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { makeStyles } from '@material-ui/core/styles';
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

export default function RegisterConnections({ onClose, integrationId }) {
  const classes = useStyles();
  const connectionsToReg = useSelector(state =>
    selectors.availableConnectionsToRegister(state, integrationId)
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

    dispatch(actions.connection.requestRegister(connectionIds, integrationId));
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
        <Typography>Register Connections</Typography>
      </DialogTitle>
      <DialogContent>
        <LoadResources required resources="connections">
          <ResourceTable
            resources={connectionsToReg}
            selectResourceRef={selectedConnections}
            metadataType="registerConnections"
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
