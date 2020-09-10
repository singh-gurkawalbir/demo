import React from 'react';
import { useDispatch } from 'react-redux';
import {
  makeStyles,
  Button,

} from '@material-ui/core';

import { MODEL_PLURAL_TO_LABEL } from '../../../../../../utils/resource';
import actions from '../../../../../../actions';
import ModalDialog from '../../../../../ModalDialog';

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
    <ModalDialog show onClose={onClose} aria-labelledby="upload-file-dialog">
      <div>
        Upload {MODEL_PLURAL_TO_LABEL[resourceType]} {type} File
      </div>

      <div>
        <label htmlFor="fileUpload">
          <Button
            data-test="selectFile"
            variant="outlined"
            color="secondary"
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
      </div>
    </ModalDialog>
  );
}
