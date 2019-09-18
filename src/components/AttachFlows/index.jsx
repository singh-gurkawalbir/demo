import { useState } from 'react';
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
import LoadResources from '../../components/LoadResources';
import ResourceTable from '../../views/ResourceList/ResourceTable';

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

export default function AttachStandAloneFlows({
  onClose,
  // integrationId,
  standAloneFlows,
}) {
  console.log('It should come here');
  const classes = useStyles();

  console.log('standAloneFlows', standAloneFlows);
  const flowsToAttch = standAloneFlows;
  const [, setSelected] = useState({});
  const selectedFlows = flows => {
    setSelected(flows);
  };

  const handleAttachFlowsClick = () => {
    // const flowIds = Object.keys(selected).filter(key => selected[key] === true);
    // Here I need to add attach flows logic.
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
        <Typography>Attach Flows</Typography>
      </DialogTitle>
      <DialogContent>
        <LoadResources required resources="flows">
          <ResourceTable
            resources={flowsToAttch}
            selectResourceRef={selectedFlows}
            metadataType="attachFlows"
            isSelectableListing
          />
        </LoadResources>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleAttachFlowsClick}>Register</Button>
      </DialogActions>
    </Dialog>
  );
}
