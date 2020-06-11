import React, { useCallback } from 'react';
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
 * resourcePathToSave - that is used while saving - optional handler extracts this values and passes through
 */
export default function DynaJsonResourcePath(props) {
  const { id, onFieldChange, value, label, resourceId, resourceType} = props;
  const jsonContent = useSelector(state => {
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

  const handleOnResourcePathChange = useCallback((id, newValue) => {
    const parsedJsonContent = extractSampleDataAtResourcePath(jsonContent, newValue);
    let resourcePathToSave;
    if (Array.isArray(parsedJsonContent)) {
      if (newValue === '') resourcePathToSave = '*';
      else resourcePathToSave = `${newValue}.*`
    }
    onFieldChange(id, {
      resourcePathToShow: newValue,
      resourcePathToSave
    });
  }, [jsonContent, onFieldChange])

  return <DynaText
    id={id}
    onFieldChange={handleOnResourcePathChange}
    value={typeof value === 'string' ? value : value.resourcePathToShow}
    label={label}
/>
}
