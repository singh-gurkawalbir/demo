import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import { withStyles } from '@material-ui/core/styles';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import { Typography } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { Fragment } from 'react';
import getRoutePath from '../../utils/routePaths';

const styles = theme => ({
  createAgentButton: {
    margin: theme.spacing.unit,
    marginTop: theme.spacing.unit * 3,
    float: 'right',
  },
});

function ResourceReferences(props) {
  const { showReferences, handleClose, references, classes, type } = props;

  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="resource-references"
      open={showReferences}>
      {references && Object.keys(references).length !== 0 ? (
        <Fragment>
          <DialogTitle id="resource-references">{`${type} References:`}</DialogTitle>
          <List>
            {Object.keys(references).map(resourceType => (
              <ListItem key={resourceType}>
                <ListItemText primary={`${resourceType}:`} />
                <List>
                  {references[resourceType].map(resource => (
                    <ListItem key={resource.id}>
                      <Link
                        to={getRoutePath(`${resourceType}/edit/${resource.id}`)}
                        className={classes.createAgentButton}>
                        <ListItemText primary={resource.name} />
                      </Link>
                      <Divider />
                    </ListItem>
                  ))}
                </List>
                <Divider />
              </ListItem>
            ))}
          </List>
        </Fragment>
      ) : (
        <Typography>This {type} is not being used anywhere</Typography>
      )}
      <Button onClick={handleClose} color="primary">
        Close
      </Button>
    </Dialog>
  );
}

export default withStyles(styles)(ResourceReferences);
