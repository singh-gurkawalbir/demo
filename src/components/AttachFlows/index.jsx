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
  makeStyles,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import * as selectors from '../../reducers';
import actions from '../../actions';
import LoadResources from '../../components/LoadResources';
import ResourceTable from '../../components/ResourceTable';
import metadata from './metadata';
import { getAllConnectionIdsUsedInTheFlow } from '../../utils/util';

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
  integrationId,
  standAloneFlows,
}) {
  const classes = useStyles();
  const flowsToAttch = standAloneFlows;
  const [selected, setSelected] = useState({});
  const handleSelectChange = flows => {
    setSelected(flows);
  };

  const exports = useSelector(
    state => selectors.resourceList(state, { type: 'exports' }).resources
  );
  const imports = useSelector(
    state => selectors.resourceList(state, { type: 'imports' }).resources
  );
  const connections = useSelector(
    state => selectors.resourceList(state, { type: 'connections' }).resources
  );
  const dispatch = useDispatch();
  const handleAttachFlowsClick = () => {
    const flowIds = Object.keys(selected).filter(key => selected[key] === true);
    const selectedFlows =
      standAloneFlows &&
      standAloneFlows.filter(f => flowIds.indexOf(f._id) > -1);
    let connectionIdsToRegister = [];

    if (!selectedFlows) return;
    selectedFlows.forEach(flow => {
      const patchSet = [
        {
          op: 'replace',
          path: '/_integrationId',
          value: integrationId,
        },
      ];

      dispatch(actions.resource.patchStaged(flow._id, patchSet, 'value'));
      dispatch(actions.resource.commitStaged('flows', flow._id, 'value'));
      connectionIdsToRegister = connectionIdsToRegister.concat(
        getAllConnectionIdsUsedInTheFlow({
          flow,
          exports,
          imports,
          connections,
        })
      );
    });
    dispatch(
      actions.connection.requestRegister(connectionIdsToRegister, integrationId)
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
        <Typography>Attach Flows</Typography>
      </DialogTitle>
      <DialogContent>
        <LoadResources
          required
          resources="flows, connections, exports, imports">
          <ResourceTable
            resources={flowsToAttch}
            onSelectChange={handleSelectChange}
            {...metadata}
            selectableRows
          />
        </LoadResources>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleAttachFlowsClick}>Attach</Button>
      </DialogActions>
    </Dialog>
  );
}
