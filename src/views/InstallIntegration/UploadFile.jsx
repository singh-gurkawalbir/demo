import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import makeStyles from '@mui/styles/makeStyles';
import { Spinner } from '@celigo/fuse-ui';
import actions from '../../actions';
import { selectors } from '../../reducers';
import getRoutePath from '../../utils/routePaths';
import Loader from '../../components/Loader';
import { OutlinedButton } from '../../components/Buttons';

const useStyles = makeStyles(theme => ({
  uploadButton: {
    margin: theme.spacing(1),
  },
  fileInput: {
    display: 'none',
  },
}));

export default function UploadFile(props) {
  const { fileType } = props;
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
    <>
      <label htmlFor="fileUpload">
        <OutlinedButton
          data-test="selectFile"
          component="span"
          className={classes.uploadButton}>
          Select template zip file
        </OutlinedButton>
        <input
          data-test="uploadFile"
          id="fileUpload"
          type="file"
          accept={fileType}
          className={classes.fileInput}
          onChange={handleUploadFileChange}
        />
      </label>
    </>
  );
}
