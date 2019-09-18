import { useState } from 'react';
import _ from 'lodash';
import { useDispatch } from 'react-redux';
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
  const selectedFlows = flows => {
    setSelected(flows);
  };

  const dispatch = useDispatch();
  const getAllTheConnectionIdsUsedInTheFlow = flow => {
    const exportIds = [];
    const importIds = [];
    const connectionIds = [];
    const borrowConnectionIds = [];

    if (!flow) {
      return connectionIds;
    }

    if (flow._exportId) {
      exportIds.push(flow._exportId);
    }

    if (flow._importId) {
      importIds.push(flow._importId);
    }

    if (flow.pageProcessors && flow.pageProcessors.length > 0) {
      flow.pageProcessors.each(pp => {
        if (pp._exportId) {
          exportIds.push(pp._exportId);
        }

        if (pp._importId) {
          importIds.push(pp._importId);
        }
      });
    }

    if (flow.pageGenerators && flow.pageGenerators.length > 0) {
      flow.pageGenerators.each(pg => {
        if (pg._exportId) {
          exportIds.push(pg._exportId);
        }

        if (pg._importId) {
          importIds.push(pg._importId);
        }
      });
    }

    return _.uniq(connectionIds.concat(borrowConnectionIds));
  };

  const handleAttachFlowsClick = () => {
    const flowIds = Object.keys(selected).filter(key => selected[key] === true);
    const selectedFlows =
      standAloneFlows &&
      standAloneFlows.filter(f => flowIds.indexOf(f._id) > -1);
    let connectionIdsToRegister = [];

    if (!selectedFlows) return;
    selectedFlows.forEach(f => {
      const patchSet = [
        {
          op: 'replace',
          path: '/_integrationId',
          value: integrationId,
        },
      ];

      dispatch(actions.resource.patchStaged(f._id, patchSet, 'value'));
      dispatch(actions.resource.commitStaged('flows', f._id, 'value'));
      connectionIdsToRegister = connectionIdsToRegister.concat(
        getAllTheConnectionIdsUsedInTheFlow(f)
      );
    });

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
