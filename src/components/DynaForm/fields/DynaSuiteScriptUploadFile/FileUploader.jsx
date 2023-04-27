import React, { useRef, useCallback } from 'react';
import Button from '@mui/material/Button';
import makeStyles from '@mui/styles/makeStyles';
import { FormControl, FormLabel } from '@mui/material';
import clsx from 'clsx';
import FieldHelp from '../../FieldHelp';
import FieldMessage from '../FieldMessage';
import isLoggableAttr from '../../../../utils/isLoggableAttr';

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
    color: '#b1c6d7',
  },
}));

export default function FileUploader(props) {
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
    classProps = {},
    hideFileName = false,
    variant = 'outlined',
    color = 'secondary',
    isLoggable,
  } = props;
  const fileInput = useRef(null);
  const classes = useStyles();
  const handleClick = useCallback(() => {
    fileInput.current.value = '';
    fileInput.current.click();
  }, []);

  return (
    <FormControl variant="standard" className={classProps.root}>
      <div className={classProps.actionContainer} >
        <div className={clsx(classes.fileUploadLabelWrapper, classProps.labelWrapper)}>
          <FormLabel required={required} className={classProps.label}>
            {label}
          </FormLabel>
          <FieldHelp {...props} />
        </div>
        <div className={clsx(classes.uploadContainer, classProps.uploadFile)}>
          <Button
            variant={variant}
            color={color}
            onClick={handleClick}
            name={name}
            disabled={disabled}
            required={required}
            className={classes.uploadBtn}
            data-test={id}>
            Choose file
          </Button>
          <input
            {...isLoggableAttr(isLoggable)}
            data-test="uploadFile"
            id="fileUpload"
            type="file"
            ref={fileInput}
            className={classes.fileInput}
            onChange={handleFileChosen}
        />
          {!hideFileName && (fileName ? <p className={classes.fileValue}> {fileName}</p> : <p className={classes.defaultText}>No file chosen</p>)}

        </div>
      </div>
      <div className={classProps.errorContainer}>
        {!isValid && <FieldMessage errorMessages={errorMessages} />}
        {uploadError && <FieldMessage errorMessages={uploadError} />}
      </div>
    </FormControl>
  );
}
