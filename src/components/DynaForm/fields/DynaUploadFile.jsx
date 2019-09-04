import React from 'react';
import TextField from '@material-ui/core/TextField';
import { useDispatch } from 'react-redux';
import { FormContext } from 'react-forms-processor/dist';
import actions from '../../../actions';
import { getFileReaderOptions, getCsvFromXlsx } from '../../../utils/file';

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
    value = '',
    label,
    formContext,
  } = props;
  const dispatch = useDispatch();
  const handleFileRead = event => {
    const { result: fileContent } = event.target;
    let csvFileContent;

    if (options === 'xlsx') {
      csvFileContent = getCsvFromXlsx(fileContent);
    }

    dispatch(
      actions.sampleData.request(
        resourceId,
        resourceType,
        {
          type: options,
          file: csvFileContent || fileContent,
          formValues: formContext.value,
        },
        'file'
      )
    );
  };

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
      label={label}
      type="file"
      placeholder={placeholder}
      disabled={disabled}
      required={required}
      error={!isValid}
      value={value}
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
