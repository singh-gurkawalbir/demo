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
  spinner: {
    margin: 'auto',
  },
  message: {
    paddingLeft: theme.spacing(3),
  },
});

function ResourceReferences(props) {
  const { classes, onClose, type, id, title } = props;
  const dispatch = useDispatch();
  const resourceReferences = useSelector(state =>
    selectors.resourceReferences(state)
  );

  useEffect(() => {
    dispatch(actions.resource.requestReferences(type, id));

    return () => dispatch(actions.resource.clearReferences());
  }, [dispatch, type, id]);

  return (
    <Fragment>
      {!resourceReferences && (
        <Loader open>
          <Typography variant="h4">
            {`Retrieving ${MODEL_PLURAL_TO_LABEL[type]} References:`}
          </Typography>
          <Spinner className={classes.spinner} />
        </Loader>
      )}
      {resourceReferences && resourceReferences.length === 0 && (
        <Loader open>
          <Typography>
            This {MODEL_PLURAL_TO_LABEL[type]} is not being used anywhere
          </Typography>
          <Button onClick={onClose} variant="outlined" color="primary">
            Close
          </Button>
        </Loader>
      )}
      {resourceReferences && resourceReferences.length !== 0 && (
        <ModalDialog handleClose={onClose} show>
          <div>
            {title
              ? `Unable to delete ${RESOURCE_TYPE_PLURAL_TO_SINGULAR[type]} as`
              : `${MODEL_PLURAL_TO_LABEL[type]} References:`}
          </div>
          <div>
            <Typography className={classes.message}>
              {title &&
                `This ${MODEL_PLURAL_TO_LABEL[type]} is referenced by the resources below. Only resources that have no references can be deleted.`}
            </Typography>
            <CeligoTable data={resourceReferences} {...metadata} />
          </div>
        </ModalDialog>
      )}
    </Fragment>
  );
}

export default withStyles(styles)(ResourceReferences);
