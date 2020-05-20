import { useRef, Fragment, useCallback } from 'react';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import FieldHelp from '../../FieldHelp';
import ErroredMessageComponent from '../ErroredMessageComponent';
import helpTextMap from '../../../Help/helpTextMap';

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
    flexDirection: `row !important`,
    width: '100%',
    alignItems: 'center',
  },
  uploadBtn: {
    marginRight: theme.spacing(0.5),
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
    helpKey,
  } = props;
  const fileInput = useRef(null);
  const classes = useStyles();
  const handleClick = useCallback(() => {
    fileInput.current.value = '';
    fileInput.current.click();
  }, []);

  return (
    <Fragment>
      <div className={classes.uploadContainer}>
        <span className={classes.fileName}>{fileName}</span>
        <Button
          variant="outlined"
          color="secondary"
          onClick={handleClick}
          name={name}
          disabled={disabled}
          required={required}
          className={classes.uploadBtn}
          data-test={id}>
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
        {/* TODO: surya we need to add the helptext for the upload file */}
        <FieldHelp {...props} helpText={helpTextMap[helpKey] || label} />
      </div>
      {!isValid && <ErroredMessageComponent errorMessages={errorMessages} />}
      {uploadError && <ErroredMessageComponent errorMessages={uploadError} />}
    </Fragment>
  );
}

export default FileUploader;
