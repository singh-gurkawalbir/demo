import { hot } from 'react-hot-loader';
import { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import { Typography, Button } from '@material-ui/core';
import actions from '../../actions';
import AgentTokenActionsMenu from './AgentDetailActionsMenu';
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
    dispatch(actions.agentToken.displayToken(id));
  },
  changeAgentToken: id => {
    dispatch(actions.agentToken.changeToken(id));
  },
  deleteAgent: id => {
    dispatch(actions.resource.delete('agents', id));
  },
  getAgentReferences: id => {
    dispatch(actions.resource.fetchResourceReferences('agents', id));
  },
});

@hot(module)
class AgentDetail extends Component {
  handleActionClick = action => {
    const {
      agent,
      deleteAgent,
      getAgentReferences,
      viewReferencesClickHandler,
    } = this.props;

    switch (action) {
      case 'edit':
        // editClickHandler(agent._id);
        break;
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
    const {
      agent,
      displayAgentToken,
      changeAgentToken,
      agentReferences,
    } = this.props;
    const { accessToken } = this.props.agentToken;

    console.log('rrrrrrrrrrr ', agentReferences);

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
          <TableCell>download installer</TableCell>
          <TableCell>status</TableCell>
          <TableCell>
            <AgentTokenActionsMenu
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
