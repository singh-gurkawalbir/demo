import { useEffect, useRef, Fragment, useCallback, useState } from 'react';
import Button from '@material-ui/core/Button';
import { useDispatch } from 'react-redux';
import { FormContext } from 'react-forms-processor/dist';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import FormHelperText from '@material-ui/core/FormHelperText';
import actions from '../../../actions';
import {
  getFileReaderOptions,
  getCsvFromXlsx,
  getJSONContent,
  getUploadedFileStatus,
} from '../../../utils/file';

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
}));

function DynaUploadFile(props) {
  const {
    options = '',
    disabled,
    id,
    isValid,
    errorMessages,
    name,
    resourceId,
    resourceType,
    required,
    label,
    formContext,
    onFieldChange,
  } = props;
  const dispatch = useDispatch();
  const fileInput = useRef(null);
  const [fileName, setFileName] = useState();
  const [uploadError, setUploadError] = useState();
  let selectedFile;
  const classes = useStyles();
  /*
   * File types supported for upload are CSV, XML, XLSX and JSON
   * For xlsx file , content gets converted to 'csv' before parsing to verify valid xlsx file
   * For JSON file, content should be parsed from String to JSON
   */
  const handleFileRead = event => {
    const { result } = event.target;
    let fileContent = result;

    if (['xlsx', 'json'].includes(options)) {
      const { error, data } =
        options === 'xlsx'
          ? getCsvFromXlsx(fileContent)
          : getJSONContent(fileContent);

      if (error) {
        return setUploadError(error);
      }

      if (options === 'json') {
        fileContent = data;
      }
    }

    setUploadError();
    setFileName(selectedFile.name);
    onFieldChange(id, fileContent);

    // Dispatches an action to process uploaded file data
    dispatch(
      actions.sampleData.request(
        resourceId,
        resourceType,
        {
          type: options,
          file: fileContent,
          formValues: formContext.value,
        },
        'file'
      )
    );
  };

  useEffect(() => {
    // resets sample data on change of file type
    if (options) {
      dispatch(actions.sampleData.reset(resourceId));
      onFieldChange(id, '', true);
      setFileName();
      setUploadError();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, id, options, resourceId]);

  /*
   * Gets the uploaded file and reads it based on the options provided
   */
  const handleFileChosen = event => {
    const file = event.target.files[0];

    if (!file) return;
    // Checks for file size and file types
    const { error } = getUploadedFileStatus(file, options);

    if (error) {
      onFieldChange(id, '');

      return setUploadError(error);
    }

    selectedFile = file;
    const fileReaderOptions = getFileReaderOptions(options);
    const fileReader = new FileReader();

    fileReader.onload = handleFileRead;

    if (fileReaderOptions.readAsArrayBuffer) {
      // Incase of XLSX file
      fileReader.readAsArrayBuffer(file);
    } else {
      fileReader.readAsText(file);
    }
  };

  const handleClick = useCallback(() => {
    fileInput.current.value = '';
    fileInput.current.click();
  }, []);

  return (
    <Fragment>
      <Typography variant="body3"> {label} </Typography>
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

const DynaUploadFileWithFormContext = props => (
  <FormContext.Consumer {...props}>
    {form => <DynaUploadFile {...props} formContext={form} />}
  </FormContext.Consumer>
);

export default DynaUploadFileWithFormContext;
