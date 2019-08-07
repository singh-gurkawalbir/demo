import { Fragment, useState } from 'react';
import { useSelector } from 'react-redux';
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
import shortid from 'shortid';
import * as selectors from '../../reducers';
import AgentDetail from './AgentDetail';
import getRoutePath from '../../utils/routePaths';
import LoadResources from '../../components/LoadResources';

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
  const [showReferences, setshowReferences] = useState(false);
  const [agentReferences, setagentReferences] = useState(null);
  const agents = useSelector(state =>
    selectors.resourceList(state, {
      type: 'agents',
    })
  );

  function viewReferencesClickHandler(references) {
    setshowReferences(true);
    setagentReferences(references);
  }

  function handleClose() {
    setshowReferences(false);
  }

  return (
    <LoadResources resources={['agents']}>
      <Dialog
        onClose={handleClose}
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
        <Button onClick={handleClose} color="primary">
          Close
        </Button>
      </Dialog>
      <Fragment>
        <Typography variant="h2" className={classes.title}>
          Agents
        </Typography>
        <Link
          to={getRoutePath(`agents/add/new-${shortid.generate()}`)}
          className={classes.createAgentButton}>
          <div>New Agent</div>
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
