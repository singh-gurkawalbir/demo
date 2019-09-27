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

export default function StackModal(props) {
  const { resourceId, onSubmitComplete, onClose, addOrSelect } = props;
  const classes = useStyles();

  return (
    <Dialog open maxWidth={false}>
      <DialogTitle>
        Setup Stack
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
            resourceType="stacks"
            resourceId={resourceId}
            onSubmitComplete={onSubmitComplete}
          />
        )}
        {addOrSelect && <AddOrSelect {...props} />}
      </DialogContent>
    </Dialog>
  );
}
