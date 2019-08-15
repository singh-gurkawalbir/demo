import { Fragment } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import { Typography, Button } from '@material-ui/core';
import actions from '../../actions';
import AgentDetailActionsMenu from './AgentDetailActionsMenu';
import AgentDownloadInstaller from './AgentDownloadInstaller';
import { confirmDialog } from '../ConfirmDialog';
import * as selectors from '../../reducers';
import getRoutePath from '../../utils/routePaths';

export default function AgentDetail(props) {
  const { agent } = props;
  const dispatch = useDispatch();
  const agentToken = useSelector(
    state => selectors.agentAccessToken(state, agent._id) || {}
  );
  const agentStatus = useSelector(state =>
    selectors.isAgentOnline(state, agent._id)
  );
  const displayAgentToken = () => {
    dispatch(actions.agent.displayToken(agent._id));
  };

  const changeAgentToken = () => {
    dispatch(actions.agent.changeToken(agent._id));
  };

  const deleteAgent = () => {
    dispatch(actions.resource.delete('agents', agent._id));
  };

  const downloadAgentInstaller = (osType, id) => {
    dispatch(actions.agent.downloadInstaller(osType, id));
  };

  const handleInstallerClick = osType => {
    downloadAgentInstaller(osType, agent._id);
  };

  const handleActionClick = action => {
    const { onReferencesClick } = props;

    switch (action) {
      case 'viewReferences':
        onReferencesClick(agent._id);
        break;
      case 'delete':
        confirmDialog({
          title: 'Confirm',
          message: 'Are you sure you want to delete this Agent?',
          buttons: [
            {
              label: 'Cancel',
            },
            {
              label: 'Yes',
              onClick: () => {
                deleteAgent();
              },
            },
          ],
        });
        break;
      default:
    }
  };

  const { accessToken } = agentToken;

  return (
    <TableRow>
      <TableCell>
        <Link to={getRoutePath(`agents/edit/${agent._id}`)}>
          <div>{agent.name}</div>
        </Link>
      </TableCell>
      <TableCell>{agent.description}</TableCell>
      <TableCell>
        <Fragment>
          {accessToken && (
            <Fragment>
              <Typography>{accessToken}</Typography>
              <Button onClick={changeAgentToken}>
                Click to generate new token
              </Button>
            </Fragment>
          )}
          {!accessToken && (
            <Button onClick={displayAgentToken}>Click to Display</Button>
          )}
        </Fragment>
      </TableCell>
      <TableCell>
        <AgentDownloadInstaller onInstallerClick={handleInstallerClick} />
      </TableCell>
      <TableCell>{agentStatus ? 'Online' : 'Offline'}</TableCell>

      <TableCell>
        <AgentDetailActionsMenu
          onActionClick={handleActionClick}
          agent={agent}
        />
      </TableCell>
    </TableRow>
  );
}
