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
import { Fragment, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import getRoutePath from '../../utils/routePaths';
import * as selectors from '../../reducers';
import actions from '../../actions';
import Spinner from '../Spinner';
import { MODEL_PLURAL_TO_LABEL } from '../../utils/resource';

const styles = theme => ({
  ReferenceLink: {
    margin: theme.spacing(1),
    marginTop: theme.spacing(3),
    float: 'right',
  },
  spinner: {
    margin: 'auto',
  },
});

function ResourceReferences(props) {
  const { classes, onReferencesClose, type, id } = props;
  const dispatch = useDispatch();
  const resourceReferences = useSelector(state =>
    selectors.resourceReferences(state)
  );

  useEffect(() => {
    dispatch(actions.resource.requestReferences(type, id));
  }, [dispatch, type, id]);

  function handleClose() {
    dispatch(actions.resource.deleteReferences());
    onReferencesClose();
  }

  return (
    <Dialog onClose={handleClose} aria-labelledby="resource-references" open>
      {resourceReferences &&
        (Object.keys(resourceReferences).length !== 0 ? (
          <Fragment>
            <DialogTitle id="resource-references">
              {`${MODEL_PLURAL_TO_LABEL[type]} References:`}
            </DialogTitle>
            <List>
              {Object.keys(resourceReferences).map(resourceType => (
                <ListItem key={resourceType}>
                  <ListItemText primary={`${resourceType}:`} />
                  <List>
                    {resourceReferences[resourceType].map(resource => (
                      <ListItem key={resource.id}>
                        <Link
                          to={getRoutePath(
                            `${resourceType}/edit/${resource.id}`
                          )}
                          onClick={handleClose}
                          className={classes.ReferenceLink}>
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
          <Typography>
            This {MODEL_PLURAL_TO_LABEL[type]} is not being used anywhere
          </Typography>
        ))}
      {!resourceReferences && (
        <Fragment>
          <Typography>
            {`Retrieving ${MODEL_PLURAL_TO_LABEL[type]} References:`}
          </Typography>
          <Spinner className={classes.spinner} />
        </Fragment>
      )}
      <Button onClick={handleClose} color="primary">
        Close
      </Button>
    </Dialog>
  );
}

export default withStyles(styles)(ResourceReferences);
