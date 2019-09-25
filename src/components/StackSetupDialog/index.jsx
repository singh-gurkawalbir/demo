import {
  IconButton,
  Dialog,
  makeStyles,
  DialogContent,
  DialogTitle,
} from '@material-ui/core';
import shortid from 'shortid';
import ResourceForm from '../../components/ResourceFormFactory';
import CloseIcon from '../icons/CloseIcon';

const useStyles = makeStyles(() => ({
  iconButton: {
    position: 'absolute',
    top: '5px',
    right: '10px',
  },
}));

export default function StackSetupModal(props) {
  const { onSubmitComplete, onClose } = props;
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
        <ResourceForm
          editMode={false}
          resourceType="stacks"
          resourceId={`new-${shortid.generate()}`}
          onSubmitComplete={onSubmitComplete}
        />
      </DialogContent>
    </Dialog>
  );
}
