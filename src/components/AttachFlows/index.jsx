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
import CloseIcon from '../icons/CloseIcon';
import * as selectors from '../../reducers';
import actions from '../../actions';
import LoadResources from '../LoadResources';
import CeligoTable from '../CeligoTable';
import metadata from './metadata';

const useStyles = makeStyles(theme => ({
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: 2,
  },
}));

export default function AttachFlows({ onClose, integrationId }) {
  const classes = useStyles();
  const flows = useSelector(state =>
    selectors
      .resourceList(state, { type: 'flows' })
      .resources.filter(f => !f._integrationId)
  );
  const [selected, setSelected] = useState({});
  const handleSelectChange = flows => {
    setSelected(flows);
  };

  const dispatch = useDispatch();
  const connectionIdsToRegister = useSelector(state => selectedFlowIds =>
    selectors.getAllConnectionIdsUsedInSelectedFlows(state, selectedFlowIds)
  );
  const handleAttachFlowsClick = () => {
    const flowIds = Object.keys(selected).filter(key => selected[key] === true);
    const selectedFlows =
      flows && flows.filter(f => flowIds.indexOf(f._id) > -1);

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
    });

    dispatch(
      actions.connection.requestRegister(
        connectionIdsToRegister(selectedFlows),
        integrationId
      )
    );
    onClose();
  };

  return (
    <Dialog open maxWidth={false}>
      <DialogTitle disableTypography>
        <Typography variant="h6">Attach Flows</Typography>
        <IconButton
          aria-label="Close"
          data-test="closeAttachFlows"
          className={classes.closeButton}
          onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <LoadResources
          required
          resources="flows, connections, exports, imports">
          <CeligoTable
            data={flows}
            onSelectChange={handleSelectChange}
            {...metadata}
            selectableRows
          />
        </LoadResources>
      </DialogContent>
      <DialogActions>
        <Button
          data-test="attachFlows"
          onClick={handleAttachFlowsClick}
          variant="contained"
          color="primary">
          Attach
        </Button>
      </DialogActions>
    </Dialog>
  );
}
