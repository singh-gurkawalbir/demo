import { withStyles } from '@material-ui/core/styles';
import { Typography, Button } from '@material-ui/core';
import { Fragment, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CeligoTable from '../../components/CeligoTable';
import * as selectors from '../../reducers';
import actions from '../../actions';
import Spinner from '../Spinner';
import { MODEL_PLURAL_TO_LABEL } from '../../utils/resource';
import ModalDialog from '../ModalDialog';
import metadata from './metadata';
import { RESOURCE_TYPE_PLURAL_TO_SINGULAR } from '../../constants/resource';
import Loader from '../Loader';

const styles = theme => ({
  referenceLink: {
    margin: theme.spacing(1),
    marginTop: theme.spacing(3),
    float: 'right',
  },
  message: {
    paddingLeft: theme.spacing(3),
  },
});

function ResourceReferences(props) {
  const { classes, onClose, resourceType, resourceId, title } = props;
  const dispatch = useDispatch();
  const resourceReferences = useSelector(state =>
    selectors.resourceReferences(state)
  );

  useEffect(() => {
    dispatch(actions.resource.requestReferences(resourceType, resourceId));

    return () => dispatch(actions.resource.clearReferences());
  }, [dispatch, resourceType, resourceId]);

  return (
    <Fragment>
      {!resourceReferences && (
        <Loader open>
          <Typography variant="h4">
            {`Retrieving ${MODEL_PLURAL_TO_LABEL[resourceType]} References`}
          </Typography>
          <Spinner color="primary" />
        </Loader>
      )}
      {resourceReferences && resourceReferences.length === 0 && (
        <Loader open>
          <Typography variant="h4">
            This {MODEL_PLURAL_TO_LABEL[resourceType]} is not being used
            anywhere
          </Typography>
          <Button onClick={onClose} variant="outlined" color="primary">
            Close
          </Button>
        </Loader>
      )}
      {resourceReferences && resourceReferences.length !== 0 && (
        <ModalDialog onClose={onClose} show>
          <div>
            {title
              ? `Unable to delete ${RESOURCE_TYPE_PLURAL_TO_SINGULAR[resourceType]} as`
              : `${MODEL_PLURAL_TO_LABEL[resourceType]} References:`}
          </div>
          <div>
            <Typography className={classes.message}>
              {title &&
                `This ${MODEL_PLURAL_TO_LABEL[resourceType]} 
                is referenced by the resources below. Only resources 
                that have no references can be deleted.`}
            </Typography>
            <CeligoTable data={resourceReferences} {...metadata} />
          </div>
        </ModalDialog>
      )}
    </Fragment>
  );
}

export default withStyles(styles)(ResourceReferences);
