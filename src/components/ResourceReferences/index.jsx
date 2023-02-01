import { makeStyles, Typography } from '@material-ui/core';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CeligoTable from '../CeligoTable';
import { selectors } from '../../reducers';
import actions from '../../actions';
import Spinner from '../Spinner';
import { MODEL_PLURAL_TO_LABEL } from '../../utils/resource';
import ModalDialog from '../ModalDialog';
import metadata from './metadata';
import Loader from '../Loader';
import { TextButton } from '../Buttons';
import messageStore, { message } from '../../utils/messageStore';
import customCloneDeep from '../../utils/customCloneDeep';

const useStyles = makeStyles(theme => ({
  referenceLink: {
    margin: theme.spacing(1),
    marginTop: theme.spacing(3),
    float: 'right',
  },
  message: {
    paddingLeft: theme.spacing(3),
  },
}));

export default function ResourceReferences({ onClose, resourceType, resourceId, title }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const resourceReferences = useSelector(state =>
    selectors.resourceReferences(state)
  );
  const resourceTypeLabel = MODEL_PLURAL_TO_LABEL[resourceType]
    ? MODEL_PLURAL_TO_LABEL[resourceType].toLowerCase()
    : '';

  useEffect(() => {
    dispatch(actions.resource.requestReferences(resourceType, resourceId));

    return () => dispatch(actions.resource.clearReferences());
  }, [dispatch, resourceType, resourceId]);

  return (
    <>
      {!resourceReferences && (
        <Loader open>
          <Typography variant="h4">
            {`Retrieving ${resourceTypeLabel} references`}
          </Typography>
          <Spinner />
        </Loader>
      )}
      {resourceReferences && resourceReferences.length === 0 && (
        <Loader open>
          <Typography variant="h4">
            {message.RESOURCE.NOT_USED}
          </Typography>
          <TextButton onClick={onClose}>
            Close
          </TextButton>
        </Loader>
      )}
      {resourceReferences && resourceReferences.length !== 0 && (
        <ModalDialog onClose={onClose} show>
          <div>
            {title
              ? `Unable to delete ${resourceTypeLabel} as`
              : 'Used by'}
          </div>
          <div>
            <Typography className={classes.message}>
              {title &&
              messageStore('RESOURCE.DELETED', {resourceTypeLabel})}
            </Typography>
            <CeligoTable actionProps={{ onClose }} data={customCloneDeep(resourceReferences)} {...metadata} />
          </div>
        </ModalDialog>
      )}
    </>
  );
}
