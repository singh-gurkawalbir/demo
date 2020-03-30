import { useEffect, useRef, Fragment, useCallback, useState } from 'react';
import Button from '@material-ui/core/Button';
import { useDispatch } from 'react-redux';
import { FormContext } from 'react-forms-processor/dist';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import actions from '../../../actions';
import {
  getFileReaderOptions,
  getCsvFromXlsx,
  getJSONContent,
  getUploadedFileStatus,
} from '../../../utils/file';
import useEnqueueSnackbar from '../../../hooks/enqueueSnackbar';

const useStyles = makeStyles(theme => ({
  fileInput: {
    display: 'none',
  },
  fileName: {
    marginLeft: theme.spacing(1),
    marginTop: '5px',
  },
  uploadContainer: {
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
    description,
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
  let selectedFile;
  const classes = useStyles();
  const [enqueueSnackbar] = useEnqueueSnackbar();
  /*
   * File types supported for upload are CSV, XML, XLSX and JSON
   */
  const handleFileRead = event => {
    const { result } = event.target;
    let fileContent = result;

    // For xlsx file , content gets converted to 'csv' before parsing to verify valid xlsx file
    if (options === 'xlsx') {
      const { success, error } = getCsvFromXlsx(fileContent);

      if (!success) {
        return enqueueSnackbar({
          message: error,
          variant: 'error',
        });
      }
    }

    // For JSON file, content should be parsed from String to JSON
    if (options === 'json') {
      const { success, error, data } = getJSONContent(fileContent);

      if (!success) {
        return enqueueSnackbar({
          message: error,
          variant: 'error',
        });
      }

      fileContent = data;
    }

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
      // eslint-disable-next-line react-hooks/exhaustive-deps
      selectedFile = undefined;
      setFileName();
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
    const fileStatus = getUploadedFileStatus(file, options);

    if (!fileStatus.success) {
      onFieldChange(id, '');

      return enqueueSnackbar({
        message: fileStatus.error,
        variant: 'error',
      });
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
          key={id + options}
          name={name}
          disabled={disabled}
          required={required}
          data-test={id}
          helperText={isValid ? description : errorMessages}
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
    </Fragment>
  );
}

const DynaUploadFileWithFormContext = props => (
  <FormContext.Consumer {...props}>
    {form => <DynaUploadFile {...props} formContext={form} />}
  </FormContext.Consumer>
);

export default DynaUploadFileWithFormContext;
