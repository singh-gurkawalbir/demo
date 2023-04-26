import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import makeStyles from '@mui/styles/makeStyles';
import { Spinner } from '@celigo/fuse-ui';
import { MODEL_PLURAL_TO_LABEL } from '../../../../../../utils/resource';
import actions from '../../../../../../actions';
import { selectors } from '../../../../../../reducers';
import { TEMPLATE_ZIP_UPLOAD_ASYNC_KEY, FORM_SAVE_STATUS } from '../../../../../../constants';
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
  const fileUploadStatus = useSelector(state => selectors.asyncTaskStatus(state, TEMPLATE_ZIP_UPLOAD_ASYNC_KEY));
  const isFileUploadInProgress = fileUploadStatus === FORM_SAVE_STATUS.LOADING;

  const handleUploadFileChange = e => {
    const file = e.target.files[0];

    dispatch(actions.file.upload({
      resourceType,
      resourceId,
      fileType,
      file,
      asyncKey: TEMPLATE_ZIP_UPLOAD_ASYNC_KEY,
    }));
  };

  useEffect(() => {
    if (fileUploadStatus === FORM_SAVE_STATUS.COMPLETE) {
      onClose();
      dispatch(actions.asyncTask.clear(TEMPLATE_ZIP_UPLOAD_ASYNC_KEY));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fileUploadStatus]);

  return (
    <ModalDialog show onClose={onClose} aria-labelledby="upload-file-dialog">
      <div>
        Upload {MODEL_PLURAL_TO_LABEL[resourceType].toLowerCase()} {type.toLowerCase()} file
      </div>

      <div>
        <label htmlFor="fileUpload">
          {isFileUploadInProgress ? <Spinner />
            : (
              <FilledButton
                data-test="selectFile"
                component="span">Select {MODEL_PLURAL_TO_LABEL[resourceType].toLowerCase()} {type.toLowerCase()} file
              </FilledButton>
            )}

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
