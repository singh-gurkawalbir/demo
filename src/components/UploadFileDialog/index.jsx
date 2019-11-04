import React from 'react';
import { useDispatch } from 'react-redux';
import {
  Dialog,
  DialogContent,
  IconButton,
  Button,
  DialogTitle,
  Divider,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import CloseIcon from '../icons/CloseIcon';
import { MODEL_PLURAL_TO_LABEL } from '../../utils/resource';
import actions from '../../actions';
import getRoutePath from '../../utils/routePaths';

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
  const {
    resourceType,
    fileType,
    onClose,
    type,
    resourceId,
    isTemplate,
  } = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  const handleUploadFileChange = e => {
    const file = e.target.files[0];

    if (isTemplate) {
      props.history.push({
        pathname: getRoutePath('/marketplace/templates/preview'),
        state: file,
      });
    } else {
      dispatch(actions.file.upload(resourceType, resourceId, fileType, file));
      onClose();
    }
  };

  return (
    <Dialog open onClose={onClose} aria-labelledby="upload-file-dialog">
      <DialogTitle
        id="upload-file-dialog"
        className={classes.title}
        disableTypography>
        <Typography variant="h6">
          Upload {MODEL_PLURAL_TO_LABEL[resourceType]} {type} File
        </Typography>
        <IconButton
          aria-label="Close"
          onClick={onClose}
          data-test="showUploadFileDialogModal"
          className={classes.closeButton}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <Divider variant="middle" />
      <DialogContent>
        <label htmlFor="fileUpload">
          <Button
            data-test="selectFile"
            variant="contained"
            component="span"
            className={classes.uploadButton}>
            Select {MODEL_PLURAL_TO_LABEL[resourceType]} {type} File
          </Button>
          <input
            data-test="uploadFile"
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
