import React, { useEffect } from 'react';
import TextField from '@material-ui/core/TextField';
import { useDispatch } from 'react-redux';
import { FormContext } from 'react-forms-processor/dist';
import actions from '../../../actions';
import {
  getFileReaderOptions,
  getCsvFromXlsx,
  getJSONContent,
  getUploadedFileStatus,
} from '../../../utils/file';
import useEnqueueSnackbar from '../../../hooks/enqueueSnackbar';

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
    placeholder,
    required,
    label,
    formContext,
    onFieldChange,
  } = props;
  const dispatch = useDispatch();
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
      onFieldChange(id, '');
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

  let acceptFileType = '*';

  if (typeof options === 'string') {
    acceptFileType = `.${options}`;
  }

  return (
    <TextField
      inputProps={{ accept: acceptFileType }}
      InputLabelProps={{ shrink: true }}
      key={id + options}
      name={name}
      data-test={id}
      label={label}
      type="file"
      placeholder={placeholder}
      disabled={disabled}
      required={required}
      helperText={isValid ? description : errorMessages}
      error={!isValid}
      onChange={handleFileChosen}
    />
  );
}

const DynaUploadFileWithFormContext = props => (
  <FormContext.Consumer {...props}>
    {form => <DynaUploadFile {...props} formContext={form} />}
  </FormContext.Consumer>
);

export default DynaUploadFileWithFormContext;
