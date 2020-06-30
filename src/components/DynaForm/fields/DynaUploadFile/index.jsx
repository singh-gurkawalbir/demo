import { FormContext } from 'react-forms-processor/dist';
import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import FileUploader from './FileUploader';
import actions from '../../../../actions';
import { getUploadedFile } from '../../../../reducers';

function DynaUploadFile(props) {
  const {
    options = '',
    id,
    maxSize,
    resourceId,
    resourceType,
    formContext,
    onFieldChange,
    placeholder,
    persistData = false,
  } = props;
  const DEFAULT_PLACEHOLDER = placeholder || 'Browse to zip file:';
  const fileId = `${resourceId}-${id}`;
  const dispatch = useDispatch();
  const [fileName, setFileName] = useState('');
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
    // The below code includes clean up of sampleData, form field and file state
    // when persistData is passed... no cleanup is done as it implies retaining existing state
    // TODO @Raghu: Find a better way to clean up only when needed
    if (options && !persistData) {
      dispatch(actions.sampleData.reset(resourceId));
      dispatch(actions.file.reset(fileId));
      onFieldChange(id, '', true);
      setFileName('');
    }

    return () => !persistData && dispatch(actions.file.reset(fileId));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, id, options, resourceId, fileId]);

  const handleFileChosen = useCallback(
    event => {
      const file = event.target.files[0];

      if (!file) return;
      dispatch(actions.file.processFile(
        {
          fileId,
          file,
          fileType: options,
          fileProps: { maxSize },
        }
      ));
    },
    [dispatch, fileId, options, maxSize]
  );

  return (
    <FileUploader
      {...props}
      label={DEFAULT_PLACEHOLDER}
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
