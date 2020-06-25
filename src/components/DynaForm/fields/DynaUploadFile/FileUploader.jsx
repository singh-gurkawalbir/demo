import React, { useRef, useCallback } from 'react';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { FormControl, FormLabel } from '@material-ui/core';
import FieldHelp from '../../FieldHelp';
import ErroredMessageComponent from '../ErroredMessageComponent';

const useStyles = makeStyles(theme => ({
  fileInput: {
    display: 'none',
  },
  fileName: {
    marginRight: theme.spacing(1),
    maxWidth: '50%',
    wordBreak: 'break-word',
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
  uploadBtn: {
    marginRight: theme.spacing(0.5),
    minWidth: 120,
  },
  fileUploadLabelWrapper: {
    display: 'flex',
  },
  fileValue: {
    margin: 0,
    marginLeft: theme.spacing(0.5),
  },
  defaultText: {
    margin: 0,
    marginLeft: theme.spacing(0.5),
    color: '#b1c6d7'
  },
}));

function FileUploader(props) {
  const {
    disabled,
    id,
    isValid,
    errorMessages,
    name,
    required,
    handleFileChosen,
    fileName,
    uploadError,
    label,
  } = props;
  const fileInput = useRef(null);
  const classes = useStyles();
  const handleClick = useCallback(() => {
    fileInput.current.value = '';
    fileInput.current.click();
  }, []);
  return (
    <FormControl>
      <div className={classes.fileUploadLabelWrapper}>
        <FormLabel required={required}>
          {label}
        </FormLabel>
        <FieldHelp {...props} />
      </div>
      <div className={classes.uploadContainer}>
        <Button
          variant="outlined"
          color="secondary"
          onClick={handleClick}
          name={name}
          disabled={disabled}
          required={required}
          className={classes.uploadBtn}
          data-test={id}>
          Choose file
        </Button>
        <input
          data-test="uploadFile"
          id="fileUpload"
          type="file"
          ref={fileInput}
          className={classes.fileInput}
          onChange={handleFileChosen}
        />
        {fileName ? <p className={classes.fileValue}> {fileName}</p> : <p className={classes.defaultText}>No file chosen</p>}

      </div>
      {!isValid && <ErroredMessageComponent errorMessages={errorMessages} />}
      {uploadError && <ErroredMessageComponent errorMessages={uploadError} />}
    </FormControl>
  );
}

export default FileUploader;
