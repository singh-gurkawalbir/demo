import { hot } from 'react-hot-loader';
import { Component, Fragment } from 'react';
import { connect } from 'react-redux';
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

const mapStateToProps = (state = [], { agent }) => {
  const agentToken = selectors.agentAccessToken(state, agent._id) || {};
  const agentReferences =
    selectors.resourceReferences(state, 'agents', agent._id) || {};

  return {
    agentToken,
    agentReferences,
  };
};

const mapDispatchToProps = dispatch => ({
  displayAgentToken: id => {
    dispatch(actions.agent.displayToken(id));
  },
  changeAgentToken: id => {
    dispatch(actions.agent.changeToken(id));
  },
  deleteAgent: id => {
    dispatch(actions.resource.delete('agents', id));
  },
  getAgentReferences: id => {
    dispatch(actions.resource.fetchResourceReferences('agents', id));
  },
  downloadAgentInstaller: (osType, id) => {
    dispatch(actions.agent.downloadInstaller(osType, id));
  },
});

@hot(module)
class AgentDetail extends Component {
  handleInstallerClick = osType => {
    const { agent, downloadAgentInstaller } = this.props;

    downloadAgentInstaller(osType, agent._id);
  };
  handleActionClick = action => {
    const {
      agent,
      deleteAgent,
      getAgentReferences,
      viewReferencesClickHandler,
    } = this.props;

    switch (action) {
      case 'viewReferences':
        getAgentReferences(agent._id);
        viewReferencesClickHandler(this.props.agentReferences);
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
                deleteAgent(agent._id);
              },
            },
          ],
        });
        break;
      default:
    }
  };

  render() {
    const { agent, displayAgentToken, changeAgentToken } = this.props;
    const { accessToken } = this.props.agentToken;

    return (
      <Fragment>
        <TableRow key={agent._id}>
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
                  <Button
                    onClick={() => {
                      changeAgentToken(agent._id);
                    }}>
                    Click to generate new token
                  </Button>
                </Fragment>
              )}
              {!accessToken && (
                <Button
                  onClick={() => {
                    displayAgentToken(agent._id);
                  }}>
                  Click to Display
                </Button>
              )}
            </Fragment>
          </TableCell>
          <TableCell>
            <AgentDownloadInstaller
              onInstallerClick={this.handleInstallerClick}
            />
          </TableCell>
          <TableCell>Offline</TableCell>
          <TableCell>
            <AgentDetailActionsMenu
              onActionClick={this.handleActionClick}
              agent={agent}
            />
          </TableCell>
        </TableRow>
      </Fragment>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AgentDetail);
