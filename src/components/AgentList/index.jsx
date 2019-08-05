import { hot } from 'react-hot-loader';
import { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Typography } from '@material-ui/core';
import Table from '@material-ui/core/Table';
import { withStyles } from '@material-ui/core/styles';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import * as selectors from '../../reducers';
import LoadResources from '../../components/LoadResources';
import AgentDetail from './AgentDetail';
import ResourceForm from '../../components/ResourceFormFactory/GenericResourceForm';

const mapStateToProps = state => {
  const agents = selectors.resourceList(state, {
    type: 'agents',
  });

  return {
    agents,
  };
};

@withStyles(theme => ({
  root: {
    width: '98%',
    marginTop: theme.spacing.unit * 3,
    marginLeft: theme.spacing.unit,
    overflowX: 'auto',
  },
  title: {
    marginBottom: theme.spacing.unit * 2,
    float: 'left',
  },
  inviteUserButton: {
    margin: theme.spacing.unit,
    textAlign: 'center',
    float: 'right',
  },
  table: {
    minWidth: 700,
  },
}))
@hot(module)
class AgentList extends Component {
  state = {
    selectedUserId: undefined,
    showUserDialog: false,
    showReferences: false,
    agentReferences: null,
  };
  viewResourcesClickHandler(references) {
    this.setState({ showReferences: true });
    this.setState({ agentReferences: references });
  }
  editAgentClickHandler(action, userId) {
    switch (action) {
      case 'create':
        this.setState({
          showUserDialog: true,
          selectedUserId: undefined,
        });
        break;
      case 'edit':
        this.setState({
          showUserDialog: true,
          selectedUserId: userId,
        });
        break;
      default:
    }
  }
  render() {
    const {
      showUserDialog,
      selectedUserId,
      showReferences,
      agentReferences,
    } = this.state;
    const { classes } = this.props;
    const { resources } = this.props.agents;

    console.log('resources ', resources);

    return (
      <LoadResources resources={['agents']}>
        <Fragment>
          {showUserDialog && <ResourceForm resourceType="agents" />}
          <div className={classes.root}>
            <Table className={classes.table}>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Access Token</TableCell>
                  <TableCell>Download Installer</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {resources &&
                  resources.map(agent => (
                    <AgentDetail
                      key={agent._id}
                      agent={agent}
                      // editAgentClickHandler={agentId => {
                      //   this.editAgentClickHandler('edit', agentId);
                      // }}
                      viewReferencesClickHandler={references => {
                        this.viewReferencesClickHandler(references);
                      }}
                    />
                  ))}
              </TableBody>
            </Table>
          </div>
        </Fragment>
      </LoadResources>
    );
  }
}

export default connect(mapStateToProps)(AgentList);
