import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import FileUploader from './FileUploader';
import actions from '../../../../actions';
import { selectors } from '../../../../reducers';

function findRowDelimiter(sampleData) {
  let rowDelimiter;

  if (sampleData && typeof sampleData === 'string') {
    if (sampleData.indexOf('\n\r') > -1) {
      rowDelimiter = '\n\r';
    } else if (sampleData.indexOf('\r\n') > -1) {
      rowDelimiter = '\r\n';
    } else if (sampleData.indexOf('\r') > -1) {
      rowDelimiter = '\r';
    } else if (sampleData.indexOf('\n') > -1) {
      rowDelimiter = '\n';
    }
  }

  return rowDelimiter;
}

export default function DynaUploadFile(props) {
  const {
    options = '',
    id,
    maxSize,
    resourceId,
    resourceType,
    onFieldChange,
    formKey,
    isIAField,
    placeholder,
    persistData = false,
  } = props;
  const DEFAULT_PLACEHOLDER = placeholder || 'Browse to zip file:';
  const fileId = `${resourceId}-${id}`;
  const dispatch = useDispatch();
  const [fileName, setFileName] = useState('');
  const uploadedFile = useSelector(
    state => selectors.getUploadedFile(state, fileId),
    shallowEqual
  );

  useEffect(() => {
    const { status, file, rawFile, name } = uploadedFile || {};

    if (status === 'received') {
      setFileName(name);
      if (isIAField) {
        onFieldChange(id, {
          file,
          type: 'file',
          rawFile,
          rowDelimiter: findRowDelimiter(file),
          fileProps: {
            name: rawFile.name,
            size: rawFile.size,
            type: rawFile.type,
          },
        });
      } else {
        onFieldChange(id, file);
      }
      dispatch(actions.resourceFormSampleData.request(formKey));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, id, resourceId, resourceType, uploadedFile]);

  useEffect(() => {
    // resets sample data on change of file type
    // The below code includes clean up of sampleData, form field and file state
    // when persistData is passed... no cleanup is done as it implies retaining existing state
    // TODO @Raghu: Find a better way to clean up only when needed
    if (options && !persistData) {
      dispatch(actions.resourceFormSampleData.clear(resourceId));
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
