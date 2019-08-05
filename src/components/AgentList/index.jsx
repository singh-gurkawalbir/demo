import { hot } from 'react-hot-loader';
import { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Table from '@material-ui/core/Table';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import * as selectors from '../../reducers';
import LoadResources from '../../components/LoadResources';
import AgentDetail from './AgentDetail';
import getRoutePath from '../../utils/routePaths';

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
    marginTop: theme.spacing.unit * 3,
    marginLeft: theme.spacing.unit,
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
  createAgentButton: {
    margin: theme.spacing.unit,
    marginTop: theme.spacing.unit * 3,
    float: 'right',
  },
}))
@hot(module)
class AgentList extends Component {
  state = {
    showReferences: false,
    agentReferences: null,
  };
  viewReferencesClickHandler(references) {
    this.setState({ showReferences: true });
    this.setState({ agentReferences: references });
  }
  handleClose = () => {
    this.setState({ showReferences: false });
  };
  render() {
    const { showReferences, agentReferences } = this.state;
    const { classes } = this.props;
    const { resources } = this.props.agents;

    return (
      <LoadResources resources={['agents']}>
        <Dialog
          onClose={this.handleClose}
          aria-labelledby="simple-dialog-title"
          open={showReferences}>
          <DialogTitle id="simple-dialog-title">Agent References:</DialogTitle>
          <List>
            {agentReferences &&
              Object.keys(agentReferences).map(key => (
                <ListItem key={key}>
                  <ListItemText primary={`${key}:`} />
                  <List>
                    {agentReferences[key].map(val => (
                      <ListItem key={val.name}>
                        <ListItemText primary={val.name} />
                        <Divider />
                      </ListItem>
                    ))}
                  </List>
                  <Divider />
                </ListItem>
              ))}
          </List>
          <Button onClick={this.handleClose} color="primary">
            Close
          </Button>
        </Dialog>
        <Fragment>
          <Typography variant="h2" component="h2" className={classes.title}>
            Agents
          </Typography>
          <Button
            component={Link}
            to={getRoutePath('agents/add/new-gX_XRD3wbxD')}
            color="primary"
            className={classes.createAgentButton}>
            Create Agent
          </Button>
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
