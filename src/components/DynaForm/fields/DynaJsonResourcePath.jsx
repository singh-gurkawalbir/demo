import React, { useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import * as selectors from '../../../reducers';
import DynaText from './DynaText';
import { extractSampleDataAtResourcePath } from '../../../utils/sampleData';

/**
 *
 * Resource path for JSON has a use case of appending * / .* in cases where parsed json content is an array
 * The following are JSON parser ( BE Implemented ) rules to adhere while we save JSON File Export
 * 1. When file has array of objects set '*'
 * 2. If file has plain json object that needs to be exported then do not set the resourcePath
 * 3. If we want to point to any particular resource in the file, set explicitly (end the json path with .* if array of objects, else just a json path)
 * To achieve above cases, we have 2 properties on this field
 * resourcePathToShow - that is visible for the user without any * appended
 * resourcePathToSave - that is used while saving - preSave extracts this values and passes through
 */
export default function DynaJsonResourcePath(props) {
  const { id, onFieldChange, value, label, resourceId, resourceType} = props;
  const jsonContent = useSelector(state => {
    // TODO: @Raghu Can be refactored to make a generic selector to get a fileType's data
    const { data: uploadedData } = selectors.getResourceSampleDataWithStatus(
      state,
      resourceId,
      'raw'
    );
    if (uploadedData && uploadedData.body) {
      return uploadedData.body;
    }
    const resource = selectors.resource(state, resourceType, resourceId);
    if (resource && resource.file.type === 'json' && resource.sampleData) {
      return resource.sampleData;
    }
  });

  if (typeof value === 'string') {
    const parsedJsonContent = extractSampleDataAtResourcePath(jsonContent, value);
    onFieldChange(id, {
      resourcePathToShow: value.replace(/\.?\*$/, ''),
      resourcePathToSave: (Array.isArray(parsedJsonContent) && !value) ? '*' : value
    });
  }

  useEffect(() => {
    // To handle whenever user uploads a new file, resourcePath should get updated
    // If it parses an array, .* gets appended
    if (jsonContent && value && typeof value === 'object') {
      const parsedJsonContent = extractSampleDataAtResourcePath(jsonContent, value.resourcePathToShow);
      let resourcePathToSave = value.resourcePathToShow;
      if (Array.isArray(parsedJsonContent)) {
        if (!resourcePathToSave) {
          resourcePathToSave = '*'
        } else {
          resourcePathToSave = `${resourcePathToSave}.*`;
        }
      }
      onFieldChange(id, { ...value, resourcePathToSave })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jsonContent])

  const handleOnResourcePathChange = useCallback((id, newValue) => {
    const parsedJsonContent = extractSampleDataAtResourcePath(jsonContent, newValue);
    let resourcePathToSave;
    // If user gives * itself, we don't make any modifications as it is a valid one
    // In other cases, if parsed content is array, resourcePathToSave adds .* to save
    if (Array.isArray(parsedJsonContent) && newValue !== '*') {
      if (newValue === '') resourcePathToSave = '*';
      else resourcePathToSave = `${newValue}.*`;
    } else {
      resourcePathToSave = newValue;
    }
    onFieldChange(id, {
      resourcePathToShow: newValue,
      resourcePathToSave
    });
  }, [jsonContent, onFieldChange])

  return <DynaText
    id={id}
    onFieldChange={handleOnResourcePathChange}
    value={value && value.resourcePathToShow}
    label={label}
/>
}
