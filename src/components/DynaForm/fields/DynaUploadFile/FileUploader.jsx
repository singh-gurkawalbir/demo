import { useRef, Fragment, useCallback } from 'react';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import FormHelperText from '@material-ui/core/FormHelperText';

const useStyles = makeStyles(theme => ({
  fileInput: {
    display: 'none',
  },
  fileName: {
    marginLeft: theme.spacing(1),
    marginTop: '5px',
  },
  uploadContainer: {
    marginTop: 5,
    display: 'flex',
    flexDirection: `row !important`,
    width: '100%',
  },
  invalid: {
    color: theme.palette.error.main,
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
    label,
    handleFileChosen,
    fileName,
    uploadError,
  } = props;
  const fileInput = useRef(null);
  const classes = useStyles();
  const handleClick = useCallback(() => {
    fileInput.current.value = '';
    fileInput.current.click();
  }, []);

  return (
    <Fragment>
      <span
        className={clsx({
          [classes.invalid]: !isValid,
        })}>
        {label}
      </span>
      <div className={classes.uploadContainer}>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleClick}
          name={name}
          disabled={disabled}
          required={required}
          data-test={id}
          isValid={isValid}
          error={!isValid}>
          Choose File
        </Button>
        <input
          data-test="uploadFile"
          id="fileUpload"
          type="file"
          ref={fileInput}
          className={classes.fileInput}
          onChange={handleFileChosen}
        />
        <span className={classes.fileName}>{fileName}</span>
      </div>
      {!isValid && (
        <FormHelperText error="true">{errorMessages}</FormHelperText>
      )}
      {uploadError && (
        <FormHelperText error="true">{uploadError}</FormHelperText>
      )}
    </Fragment>
  );
}

export default FileUploader;
