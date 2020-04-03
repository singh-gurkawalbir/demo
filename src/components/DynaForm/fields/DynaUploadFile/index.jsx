import { FormContext } from 'react-forms-processor/dist';
import { useEffect, useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import FileUploader from './FileUploader';
import actions from '../../../../actions';
import {
  getFileReaderOptions,
  getCsvFromXlsx,
  getJSONContent,
  getUploadedFileStatus,
} from '../../../../utils/file';

function DynaUploadFile(props) {
  const {
    options = '',
    id,
    resourceId,
    resourceType,
    formContext,
    onFieldChange,
  } = props;
  const DEFAULT_PLACEHOLDER = 'No file chosen';
  const dispatch = useDispatch();
  const [fileName, setFileName] = useState(DEFAULT_PLACEHOLDER);
  const [uploadError, setUploadError] = useState();
  /*
   * File types supported for upload are CSV, XML, XLSX and JSON
   * For xlsx file , content gets converted to 'csv' before parsing to verify valid xlsx file
   * For JSON file, content should be parsed from String to JSON
   */
  const handleFileRead = useCallback(
    (event, fileName) => {
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
      setFileName(fileName);
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
    },
    [
      dispatch,
      formContext.value,
      id,
      onFieldChange,
      options,
      resourceId,
      resourceType,
    ]
  );

  useEffect(() => {
    // resets sample data on change of file type
    if (options) {
      dispatch(actions.sampleData.reset(resourceId));
      onFieldChange(id, '', true);
      setFileName(DEFAULT_PLACEHOLDER);
      setUploadError();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, id, options, resourceId]);

  /*
   * Gets the uploaded file and reads it based on the options provided
   */
  const handleFileChosen = useCallback(
    event => {
      const file = event.target.files[0];

      if (!file) return;
      // Checks for file size and file types
      const { error } = getUploadedFileStatus(file, options);

      if (error) {
        onFieldChange(id, '');

        return setUploadError(error);
      }

      const fileReaderOptions = getFileReaderOptions(options);
      const fileReader = new FileReader();
      const curriedFileNameFn = fileName => event =>
        handleFileRead(event, fileName);

      fileReader.onload = curriedFileNameFn(file.name);

      if (fileReaderOptions.readAsArrayBuffer) {
        // Incase of XLSX file
        fileReader.readAsArrayBuffer(file);
      } else {
        fileReader.readAsText(file);
      }
    },
    [handleFileRead, id, onFieldChange, options]
  );

  return (
    <FileUploader
      {...props}
      fileName={fileName}
      uploadError={uploadError}
      handleFileChosen={handleFileChosen}
    />
  );
}

const DynaUploadFileWithFormContext = props => (
  <FormContext.Consumer {...props}>
    {form => <DynaUploadFile {...props} formContext={form} />}
  </FormContext.Consumer>
);

export default DynaUploadFileWithFormContext;
