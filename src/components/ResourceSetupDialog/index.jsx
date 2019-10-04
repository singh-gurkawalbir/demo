import {
  IconButton,
  Dialog,
  makeStyles,
  DialogContent,
  DialogTitle,
} from '@material-ui/core';
import ResourceForm from '../../components/ResourceFormFactory';
import LoadResources from '../LoadResources';
import CloseIcon from '../icons/CloseIcon';
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

  return (
    <LoadResources required resources="connections">
      <Dialog open maxWidth={false}>
        <DialogTitle>
          Setup {RESOURCE_TYPE_PLURAL_TO_SINGULAR[resourceType]}
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
          {!addOrSelect && (
            <ResourceForm
              editMode={false}
              resourceType={resourceType}
              resourceId={resourceId}
              onSubmitComplete={onSubmitComplete}
              connectionType={connectionType}
              onCancel={onClose}
            />
          )}
          {addOrSelect && <AddOrSelect {...props} />}
        </DialogContent>
      </Dialog>
    </LoadResources>
  );
}
