import {
  IconButton,
  Dialog,
  makeStyles,
  DialogContent,
  DialogTitle,
} from '@material-ui/core';
import ResourceForm from '../../components/ResourceFormFactory';
import CloseIcon from '../icons/CloseIcon';
import AddOrSelect from './AddOrSelect';

const useStyles = makeStyles(() => ({
  iconButton: {
    position: 'absolute',
    top: '5px',
    right: '10px',
  },
}));

export default function ConnectionModal(props) {
  const {
    _connectionId,
    onSubmitComplete,
    onClose,
    addOrSelect,
    connectionType,
  } = props;
  const classes = useStyles();

  return (
    <Dialog open maxWidth={false}>
      <DialogTitle>
        Setup Connection
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
            resourceType="connections"
            resourceId={_connectionId}
            onSubmitComplete={onSubmitComplete}
            connectionType={connectionType}
          />
        )}
        {addOrSelect && <AddOrSelect {...props} />}
      </DialogContent>
    </Dialog>
  );
}
