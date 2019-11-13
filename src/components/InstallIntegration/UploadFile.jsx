import React, { useEffect, Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import actions from '../../actions';
import * as selectors from '../../reducers';
import getRoutePath from '../../utils/routePaths';

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
    <Fragment>
      <label htmlFor="fileUpload">
        <Button
          data-test="selectFile"
          variant="contained"
          component="span"
          className={classes.uploadButton}>
          Select Template Zip File
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
