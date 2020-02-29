import React, { useEffect, Fragment, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import actions from '../../../actions';
import * as selectors from '../../../reducers';
import Loader from '../../Loader';
import Spinner from '../../Spinner';

const useStyles = makeStyles(theme => ({
  uploadButton: {
    margin: theme.spacing(1),
  },
  fileInput: {
    display: 'none',
  },
}));

export default function UploadFile({ fileType }) {
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
      history.replace(`${location.pathname}/preview/${templateId}`);
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
      <Loader open>
        Uploading...
        <Spinner />
      </Loader>
    );
  }

  return (
    <Fragment>
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
          accept={fileType}
          className={classes.fileInput}
          onChange={handleUploadFileChange}
        />
      </label>
    </Fragment>
  );
}
