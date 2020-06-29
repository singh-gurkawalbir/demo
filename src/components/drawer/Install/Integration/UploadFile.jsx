import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import actions from '../../../../actions';
import * as selectors from '../../../../reducers';
import SystemStatus from '../../../SystemStatus';

const useStyles = makeStyles(theme => ({
  uploadButton: {
    margin: theme.spacing(1),
  },
  fileInput: {
    display: 'none',
  },
}));

export default function UploadFile() {
  const history = useHistory();
  const location = useLocation();
  const [uploadInProgress, setUploadInProgress] = useState(false);
  const { isFileUploaded, templateId } = useSelector(state =>
    selectors.isFileUploaded(state)
  );
  const classes = useStyles();
  const dispatch = useDispatch();

  useEffect(() => {
    if (isFileUploaded) {
      history.push(`${location.pathname}/preview/${templateId}`);
      setUploadInProgress(false);
      dispatch(actions.template.clearUploaded(templateId));
    }
  }, [dispatch, isFileUploaded, location, history, templateId]);
  const handleUploadFileChange = e => {
    const file = e.target.files[0];

    dispatch(actions.file.previewZip(file));
    setUploadInProgress(true);
  };

  if (uploadInProgress) {
    return (
      <SystemStatus>
        <Typography variant="h4">Loading</Typography>
      </SystemStatus>
    );
  }

  return (
    <>
      <Typography variant="h4">Upload</Typography>
      <Typography>Choose a .zip file to begin the installation.</Typography>
      <label htmlFor="fileUpload">
        <Button
          data-test="selectFile"
          variant="outlined"
          color="primary"
          component="span"
          className={classes.uploadButton}>
          Select template zip file
        </Button>
        <input
          data-test="uploadFile"
          id="fileUpload"
          type="file"
          accept={'fileType="application/zip"'}
          className={classes.fileInput}
          onChange={handleUploadFileChange}
        />
      </label>
    </>
  );
}
