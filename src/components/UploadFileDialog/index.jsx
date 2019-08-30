import React from 'react';
import { useDispatch } from 'react-redux';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import DialogTitle from '@material-ui/core/DialogTitle';
import Divider from '@material-ui/core/Divider';
import { MODEL_PLURAL_TO_LABEL } from '../../utils/resource';
import actions from '../../actions';

const styles = theme => ({
  title: {
    marginLeft: theme.spacing(4),
    padding: theme.spacing(2),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
  },
  uploadButton: {
    margin: theme.spacing(1),
  },
  fileInput: {
    display: 'none',
  },
});

function UploadFileDialog(props) {
  const { resourceType, fileType, onClose, classes, type, resourceId } = props;
  const dispatch = useDispatch();
  const handleUploadFileChange = e => {
    const file = e.target.files[0];

    dispatch(actions.file.upload(resourceType, resourceId, fileType, file));
    onClose();
  };

  return (
    <Dialog open onClose={onClose} aria-labelledby="upload-file-dialog">
      <IconButton
        aria-label="Close"
        onClick={onClose}
        className={classes.closeButton}>
        <CloseIcon />
      </IconButton>
      <DialogTitle id="upload-file-dialog" className={classes.title}>
        Upload {MODEL_PLURAL_TO_LABEL[resourceType]} {type} File
      </DialogTitle>
      <Divider variant="middle" />
      <DialogContent>
        <label htmlFor="fileUpload">
          <Button
            variant="contained"
            component="span"
            className={classes.uploadButton}>
            Select {MODEL_PLURAL_TO_LABEL[resourceType]} {type} File
          </Button>
          <input
            id="fileUpload"
            type="file"
            accept={fileType}
            className={classes.fileInput}
            onChange={handleUploadFileChange}
          />
        </label>
      </DialogContent>
    </Dialog>
  );
}

export default withStyles(styles)(UploadFileDialog);
