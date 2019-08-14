import { Fragment, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Table from '@material-ui/core/Table';
import { withStyles } from '@material-ui/core/styles';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import shortid from 'shortid';
import * as selectors from '../../reducers';
import AgentDetail from './AgentDetail';
import getRoutePath from '../../utils/routePaths';
import LoadResources from '../../components/LoadResources';
import ResourceReferences from '../../components/ResourceReferences';

const styles = theme => ({
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
});

function AgentList(props) {
  const { classes } = props;
  const [showReferences, setShowReferences] = useState(false);
  const [agentReferences, setAgentReferences] = useState(null);
  const agents = useSelector(state =>
    selectors.resourceList(state, {
      type: 'agents',
    })
  );

  function viewReferencesClickHandler(references) {
    setShowReferences(true);
    setAgentReferences(references);
  }

  function handleClose() {
    setShowReferences(false);
  }

  return (
    <LoadResources resources={['agents']}>
      <ResourceReferences
        type="Agent"
        showReferences={showReferences}
        handleClose={handleClose}
        references={agentReferences}
      />
      <Fragment>
        <Typography variant="h2" className={classes.title}>
          Agents
        </Typography>
        <Link
          to={getRoutePath(`agents/add/new-${shortid.generate()}`)}
          className={classes.createAgentButton}>
          <div>+ New Agent</div>
        </Link>
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
              {agents.resources &&
                agents.resources.map(agent => (
                  <AgentDetail
                    key={agent._id}
                    agent={agent}
                    viewReferencesClickHandler={references => {
                      viewReferencesClickHandler(references);
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

export default withStyles(styles)(AgentList);
