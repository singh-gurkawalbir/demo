import { useState } from 'react';
import _ from 'lodash';
import { useSelector, useDispatch } from 'react-redux';
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
      flow.pageProcessors.forEach(pp => {
        if (pp._exportId) {
          exportIds.push(pp._exportId);
        }

        if (pp._importId) {
          importIds.push(pp._importId);
        }
      });
    }

    if (flow.pageGenerators && flow.pageGenerators.length > 0) {
      flow.pageGenerators.forEach(pg => {
        if (pg._exportId) {
          exportIds.push(pg._exportId);
        }

        if (pg._importId) {
          importIds.push(pg._importId);
        }
      });
    }

    const AttachedExports =
      exports && exports.filter(e => exportIds.indexOf(e._id) > -1);
    const AttachedImports =
      imports && imports.filter(i => importIds.indexOf(i._id) > -1);

    AttachedExports.forEach(exp => {
      if (exp && exp._connectionId) {
        connectionIds.push(exp._connectionId);
      }
    });
    AttachedImports.forEach(imp => {
      if (imp && imp._connectionId) {
        connectionIds.push(imp._connectionId);
      }
    });
    const AttachedConnections =
      connections &&
      connections.filter(conn => connectionIds.indexOf(conn._id) > -1);

    AttachedConnections.forEach(conn => {
      if (conn && conn._borrowConcurrencyFromConnectionId) {
        borrowConnectionIds.push(conn._borrowConcurrencyFromConnectionId);
      }
    });

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
            selectResourceRef={selectedFlows}
            metadataType="attachFlows"
            isSelectableListing
          />
        </LoadResources>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleAttachFlowsClick}>Attach</Button>
      </DialogActions>
    </Dialog>
  );
}
