import { useState } from 'react';
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
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(1),
    overflowX: 'auto',
  },
  title: {
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(1),
    float: 'left',
  },
  inviteUserButton: {
    margin: theme.spacing(1),
    textAlign: 'center',
    float: 'right',
  },
  table: {
    minWidth: 700,
  },
  createAgentButton: {
    margin: theme.spacing(1),
    marginTop: theme.spacing(3),
    float: 'right',
  },
});

function AgentList(props) {
  const { classes } = props;
  const [showReferences, setShowReferences] = useState(false);
  const [agentId, setAgentId] = useState(null);
  const agents = useSelector(state =>
    selectors.resourceList(state, {
      type: 'agents',
    })
  );

  function handleReferencesClick(id) {
    setShowReferences(true);
    setAgentId(id);
  }

  function handleReferencesClose() {
    setShowReferences(false);
    setAgentId(null);
  }

  return (
    <LoadResources resources={['agents']}>
      {showReferences && agentId && (
        <ResourceReferences
          type="agents"
          id={agentId}
          onReferencesClose={handleReferencesClose}
        />
      )}

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
                  onReferencesClick={id => {
                    handleReferencesClick(id);
                  }}
                />
              ))}
          </TableBody>
        </Table>
      </div>
    </LoadResources>
  );
}

export default withStyles(styles)(AgentList);
