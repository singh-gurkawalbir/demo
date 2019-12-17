import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import actions from '../../actions';
import * as selectors from '../../reducers';
import getRoutePath from '../../utils/routePaths';
import ModalDialog from '../../components/ModalDialog';
import Loader from '../../components/Loader';
import Spinner from '../../components/Spinner';

const useStyles = makeStyles(theme => ({
  uploadButton: {
    margin: theme.spacing(1),
  },
  fileInput: {
    display: 'none',
  },
}));

export default function InstallIntegrationDialog(props) {
  const { fileType, onClose } = props;
  const [uploadInProgress, setUploadInProgress] = useState(false);
  const { isFileUploaded, templateId } = useSelector(state =>
    selectors.isFileUploaded(state)
  );
  const classes = useStyles();
  const dispatch = useDispatch();

  useEffect(() => {
    if (isFileUploaded) {
      props.history.push(getRoutePath(`/templates/${templateId}/preview`));
      setUploadInProgress(false);
      dispatch(actions.template.clearUploaded(templateId));
    }
  }, [dispatch, isFileUploaded, props.history, templateId]);
  const handleUploadFileChange = e => {
    const file = e.target.files[0];

    dispatch(actions.file.previewZip(file));
    setUploadInProgress(true);
  };

  if (uploadInProgress) {
    return (
      <Loader open>
        Uploading...
        <Spinner />
      </Loader>
    );
  }

  return (
    <ModalDialog onClose={onClose} show>
      <div>Upload Integration Zip File</div>
      <div>
        <label htmlFor="fileUpload">
          <Button
            data-test="selectFile"
            variant="contained"
            color="secondary"
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
      </div>
    </ModalDialog>
  );
}
