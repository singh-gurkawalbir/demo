import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
import actions from '../../actions';
import * as selectors from '../../reducers';
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

export default function InstallIntegrationDialog(props) {
  const { fileType, onClose } = props;
  const { isFileUploaded, templateId } = useSelector(state =>
    selectors.isFileUploaded(state)
  );
  const classes = useStyles();
  const dispatch = useDispatch();

  useEffect(() => {
    if (isFileUploaded) {
      props.history.push(getRoutePath(`/templates/${templateId}/preview`));
      dispatch(actions.template.clearUploaded(templateId));
    }
  }, [dispatch, isFileUploaded, props.history, templateId]);
  const handleUploadFileChange = e => {
    const file = e.target.files[0];

    dispatch(actions.file.previewZip(file));
  };

  return (
    <Dialog open onClose={onClose} aria-labelledby="integration-install-dialog">
      <DialogTitle
        id="integration-install-dialog"
        className={classes.title}
        disableTypography>
        <Typography variant="h6">Upload Integration Zip File</Typography>
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
            Select Zip File
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
