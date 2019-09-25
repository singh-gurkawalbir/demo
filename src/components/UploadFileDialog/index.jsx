import React from 'react';
import { useDispatch } from 'react-redux';
import {
  Dialog,
  DialogContent,
  IconButton,
  Button,
  DialogTitle,
  Divider,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import CloseIcon from '../icons/CloseIcon';
import { MODEL_PLURAL_TO_LABEL } from '../../utils/resource';
import actions from '../../actions';

const useStyles = makeStyles(theme => ({
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
}));

export default function UploadFileDialog(props) {
  const { resourceType, fileType, onClose, type, resourceId } = props;
  const classes = useStyles();
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
