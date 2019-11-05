import { withStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
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
    <ModalDialog handleClose={onClose} show>
      <div>
        {resourceReferences && resourceReferences.length !== 0 && (
          <Fragment>
            {title
              ? `Unable to delete ${RESOURCE_TYPE_PLURAL_TO_SINGULAR[type]} as`
              : `${MODEL_PLURAL_TO_LABEL[type]} References:`}
          </Fragment>
        )}
      </div>
      <div>
        {resourceReferences &&
          (resourceReferences.length !== 0 ? (
            <Fragment>
              <Typography className={classes.message}>
                {title &&
                  `This ${MODEL_PLURAL_TO_LABEL[type]} is referenced by the resources below. Only resources that have no references can be deleted.`}
              </Typography>
              <CeligoTable data={resourceReferences} {...metadata} />
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
      </div>
    </ModalDialog>
  );
}

export default withStyles(styles)(ResourceReferences);
