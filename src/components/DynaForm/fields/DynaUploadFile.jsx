import React from 'react';
import TextField from '@material-ui/core/TextField';
import { useDispatch } from 'react-redux';
import actions from '../../../actions';

export default function DynaUploadFile(props) {
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
  } = props;
  const dispatch = useDispatch();
  const handleFileRead = event => {
    const { result: fileContent } = event.target;

    dispatch(
      actions.sampleData.request(
        resourceId,
        resourceType,
        {
          type: options,
          file: fileContent,
        },
        'file'
      )
    );
  };

  const handleFileChosen = event => {
    const file = event.target.files[0];
    // if (!file) return;
    // const fileReaderOptions = getFileReaderOptions(file, options);
    const fileReader = new FileReader();

    fileReader.onload = handleFileRead;

    fileReader.readAsText(file);
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
