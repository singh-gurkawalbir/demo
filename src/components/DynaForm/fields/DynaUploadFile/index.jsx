import { FormContext } from 'react-forms-processor/dist';
import { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import FileUploader from './FileUploader';
import actions from '../../../../actions';
import { getUploadedFile } from '../../../../reducers';

function DynaUploadFile(props) {
  const {
    options = '',
    id,
    resourceId,
    resourceType,
    formContext,
    onFieldChange,
  } = props;
  const DEFAULT_PLACEHOLDER = 'Sample file (that would be parsed):';
  const fileId = `${resourceId}-${id}`;
  const dispatch = useDispatch();
  const [fileName, setFileName] = useState(DEFAULT_PLACEHOLDER);
  const uploadedFile = useSelector(
    state => getUploadedFile(state, fileId),
    shallowEqual
  );

  useEffect(() => {
    const { status, file, fileType, name } = uploadedFile || {};

    if (status === 'received') {
      setFileName(name);
      onFieldChange(id, file);
      dispatch(
        actions.sampleData.request(
          resourceId,
          resourceType,
          {
            type: fileType,
            file,
            formValues: formContext.value,
          },
          'file'
        )
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, id, resourceId, resourceType, uploadedFile]);

  useEffect(() => {
    // resets sample data on change of file type
    if (options) {
      dispatch(actions.sampleData.reset(resourceId));
      dispatch(actions.file.reset(fileId));
      onFieldChange(id, '', true);
      setFileName(DEFAULT_PLACEHOLDER);
    }

    return () => dispatch(actions.file.reset(fileId));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, id, options, resourceId, fileId]);

  const handleFileChosen = useCallback(
    event => {
      const file = event.target.files[0];

      if (!file) return;
      dispatch(actions.file.processFile({ fileId, file, fileType: options }));
    },
    [dispatch, fileId, options]
  );

  return (
    <FileUploader
      {...props}
      fileName={fileName}
      uploadError={uploadedFile && uploadedFile.error}
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
