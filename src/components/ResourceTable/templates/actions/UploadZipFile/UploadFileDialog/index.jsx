import React from 'react';
import { useDispatch } from 'react-redux';
import {
  makeStyles,
} from '@material-ui/core';

import { MODEL_PLURAL_TO_LABEL } from '../../../../../../utils/resource';
import actions from '../../../../../../actions';
import ModalDialog from '../../../../../ModalDialog';
import FilledButton from '../../../../../Buttons/FilledButton';

const useStyles = makeStyles({
  fileInput: {
    display: 'none',
  },
});

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
        Upload {MODEL_PLURAL_TO_LABEL[resourceType].toLowerCase()} {type.toLowerCase()} file
      </div>

      <div>
        <label htmlFor="fileUpload">
          <FilledButton
            data-test="selectFile"
            component="span">
            Select {MODEL_PLURAL_TO_LABEL[resourceType].toLowerCase()} {type.toLowerCase()} file
          </FilledButton>
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
