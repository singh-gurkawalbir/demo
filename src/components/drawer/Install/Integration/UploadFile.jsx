import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Typography, FormControl, FormLabel } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { Spinner } from '@celigo/fuse-ui';
import actions from '../../../../actions';
import { selectors } from '../../../../reducers';
import { buildDrawerUrl, drawerPaths } from '../../../../utils/rightDrawer';
import FieldMessage from '../../../DynaForm/fields/FieldMessage';
import errorMessageStore from '../../../../utils/errorStore';
import { MAX_TEMPLATE_ZIP_SIZE } from '../../../../constants';
import { message } from '../../../../utils/messageStore';

const useStyles = makeStyles(theme => ({
  uploadButton: {
    marginRight: theme.spacing(0.5),
    minWidth: 120,
  },
  fileInput: {
    display: 'none',
  },
  formControlUploadFile: {
    background: theme.palette.background.paper,
    padding: theme.spacing(2),
    width: '100%',
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
    borderRadius: theme.spacing(0.5),
    marginTop: theme.spacing(2),
  },
  fileUploadLabelWrapper: {
    display: 'flex',
    marginBottom: theme.spacing(1),
  },
  uploadContainer: {
    flexDirection: 'row !important',
    width: '100%',
    display: 'flex',
    wordBreak: 'break-word',
    alignItems: 'center',
    border: '1px solid',
    background: theme.palette.background.paper,
    borderColor: theme.palette.secondary.lightest,
    padding: theme.spacing(1),
    borderRadius: theme.spacing(0.5),
  },
  defaultText: {
    margin: 0,
    marginLeft: theme.spacing(0.5),
    color: theme.palette.secondary.contrastText,
  },
}));

export default function UploadFile() {
  const history = useHistory();
  const location = useLocation();
  const [uploadInProgress, setUploadInProgress] = useState(false);
  const [error, setError] = useState();
  const { isFileUploaded, templateId } = useSelector(state =>
    selectors.isFileUploaded(state)
  );
  const {previewFailedStatus, id} = useSelector(state =>
    selectors.isPreviewStatusFailed(state)
  );

  const classes = useStyles();
  const dispatch = useDispatch();

  useEffect(() => {
    if (isFileUploaded) {
      history.push(buildDrawerUrl({
        path: drawerPaths.INSTALL.INTEGRATION_PREVIEW,
        baseUrl: location.pathname,
        params: { templateId },
      }));
      setUploadInProgress(false);
      dispatch(actions.template.clearUploaded(templateId));
    }
  }, [dispatch, isFileUploaded, location, history, templateId]);

  useEffect(() => {
    if (previewFailedStatus) {
      setUploadInProgress(false);
      dispatch(actions.template.clearUploaded(id));
    }
  }, [dispatch, previewFailedStatus, id]);

  const handleUploadFileChange = e => {
    setError();
    const file = e.target.files[0];

    if (file?.size > MAX_TEMPLATE_ZIP_SIZE) {
      setError(errorMessageStore('FILE_SIZE_EXCEEDED'));
    } else {
      dispatch(actions.file.previewZip(file));
      setUploadInProgress(true);
    }
  };

  if (uploadInProgress) {
    return (
      <Spinner size="large" center="screen" sx={{mt: '60px'}} />
    );
  }

  return (
    <div>
      <Typography variant="h5">{message.INSTALL_ZIP_FILE}</Typography>
      <FormControl variant="standard" className={classes.formControlUploadFile}>
        <div className={classes.fileUploadLabelWrapper}>
          <FormLabel required>
            Browse to Zip file
          </FormLabel>
        </div>
        <div className={classes.uploadContainer}>
          <label htmlFor="fileUpload">
            <Button
              data-test="selectFile"
              variant="outlined"
              color="secondary"
              component="span"
              className={classes.uploadButton}>
              Choose file
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
          <p className={classes.defaultText}>No file chosen</p>
        </div>
        {error && <FieldMessage errorMessages={error} />}
      </FormControl>
    </div>
  );
}
