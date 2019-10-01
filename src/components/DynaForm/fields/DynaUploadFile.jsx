import React from 'react';
import TextField from '@material-ui/core/TextField';
import { useDispatch } from 'react-redux';
import { FormContext } from 'react-forms-processor/dist';
import actions from '../../../actions';
import { getFileReaderOptions, getCsvFromXlsx } from '../../../utils/file';
import useEnqueueSnackbar from '../../../hooks/enqueueSnackbar';

function DynaUploadFile(props) {
  const {
    options,
    disabled,
    id,
    isValid,
    name,
    resourceId,
    resourceType,
    placeholder,
    required,
    label,
    formContext,
  } = props;
  const dispatch = useDispatch();
  const [enqueueSnackbar] = useEnqueueSnackbar();
  /*
   * File types supported for upload are CSV, XML, XLSX and JSON
   */
  const handleFileRead = event => {
    const { result } = event.target;
    let fileContent = result;

    // For xlsx file , content gets converted to 'csv' before parsing
    if (options === 'xlsx') {
      const { success, result, error } = getCsvFromXlsx(fileContent);

      if (!success) {
        return enqueueSnackbar({
          message: error,
          variant: 'error',
        });
      }

      fileContent = result;
    }

    // For JSON file, content should be parsed from String to JSON
    if (options === 'json') {
      fileContent = JSON.parse(fileContent);
    }

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

  /*
   * Gets the uploaded file and reads it based on the options provided
   */
  const handleFileChosen = event => {
    const file = event.target.files[0];

    if (!file) return;
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

  let acceptFileType = '.txt';

  if (options) {
    acceptFileType = `.${options}`;
  }

  return (
    <TextField
      inputProps={{ accept: acceptFileType }}
      InputLabelProps={{ shrink: true }}
      key={id}
      name={name}
      data-test={id}
      label={label}
      type="file"
      placeholder={placeholder}
      disabled={disabled}
      required={required}
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
