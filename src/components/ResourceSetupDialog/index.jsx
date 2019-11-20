import {
  IconButton,
  Dialog,
  makeStyles,
  DialogContent,
  DialogTitle,
  Typography,
} from '@material-ui/core';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import ResourceForm from '../../components/ResourceFormFactory';
import LoadResources from '../LoadResources';
import CloseIcon from '../icons/CloseIcon';
import * as selectors from '../../reducers';
import AddOrSelect from './AddOrSelect';
import { RESOURCE_TYPE_PLURAL_TO_SINGULAR } from '../../constants/resource';

const useStyles = makeStyles(() => ({
  iconButton: {
    position: 'absolute',
    top: '5px',
    right: '10px',
  },
}));

export default function ResourceModal(props) {
  const {
    resourceId,
    onSubmitComplete,
    onClose,
    addOrSelect,
    connectionType,
    resourceType = 'connections',
  } = props;
  const classes = useStyles();
  const isAuthorized = useSelector(state =>
    selectors.isAuthorized(state, resourceId)
  );

  useEffect(() => {
    if (isAuthorized && !addOrSelect)
      onSubmitComplete(resourceId, isAuthorized);
  }, [isAuthorized, resourceId, onSubmitComplete, addOrSelect]);

  return (
    <LoadResources required resources="connections">
      <Dialog open maxWidth={false}>
        <DialogTitle disableTypography>
          <Typography variant="h6">
            Setup {RESOURCE_TYPE_PLURAL_TO_SINGULAR[resourceType]}
          </Typography>
          {onClose && (
            <IconButton
              onClick={onClose}
              className={classes.iconButton}
              autoFocus>
              <CloseIcon />
            </IconButton>
          )}
        </DialogTitle>
        <DialogContent style={{ width: '60vw' }}>
          {addOrSelect ? (
            <AddOrSelect {...props} />
          ) : (
            <ResourceForm
              editMode={false}
              resourceType={resourceType}
              resourceId={resourceId}
              onSubmitComplete={onSubmitComplete}
              connectionType={connectionType}
              onCancel={onClose}
            />
          )}
        </DialogContent>
      </Dialog>
    </LoadResources>
  );
}
