import React, { Fragment } from 'react';
import InputWithLookupHandlebars from './InputWithLookupHandlebars';
import { adaptorTypeMap } from '../../../../utils/resource';

// match all characters
const prefixRegexp = '(.*?)';

export default function IgnoreExistingData(props) {
  const {
    connectionId,
    disabled,
    errorMessages,
    id,
    isValid,
    multiline,
    name,
    onFieldChange,
    placeholder,
    required,
    value,
    label,
    options = {},
    resourceId,
    resourceType,
    flowId,
    arrayIndex,
    adaptorType,
    sampleData,
    extractFields,
    connection,
  } = props;
  const { resourceName, lookups } = options;
  const { fieldId: lookupFieldId, data: lookupData } = lookups || {};
  const handleLookupUpdate = lookups => {
    onFieldChange(lookupFieldId, lookups);
  };

  const handleFieldChange = (_id, val) => {
    if (typeof arrayIndex === 'number' && Array.isArray(value)) {
      // save to array at position arrayIndex
      const valueTmp = value;

      valueTmp[arrayIndex] = val;
      onFieldChange(id, valueTmp);
    } else {
      // save to field
      onFieldChange(id, val);
    }
  };

  const extactedVal =
    options && typeof arrayIndex === 'number' && Array.isArray(value)
      ? value[arrayIndex]
      : value;
  const isSqlImport =
    adaptorType && adaptorTypeMap[adaptorType] === adaptorTypeMap.RDBMSImport;
  const getMatchedValueforSuggestion = (_val, cursorPosition) => {
    const inpValue = _val.substring(0, cursorPosition);
    const startIndexOfBraces = inpValue.lastIndexOf(' ');
    const matchedString = inpValue.substring(startIndexOfBraces + 1);

    return matchedString;
  };

  const getUpdatedFieldValue = (userInput, cursorPosition, insertedVal) => {
    const textBeforeCursor = userInput.substring(0, cursorPosition);
    const spaceIndexBeforeCursor = textBeforeCursor.lastIndexOf(' ');
    const preText = userInput.substring(0, spaceIndexBeforeCursor + 1);
    const postText = userInput.substring(cursorPosition);

    return `${preText}${insertedVal}${postText}`;
  };

  return (
    <Fragment>
      <InputWithLookupHandlebars
        key={id}
        name={name}
        label={label}
        placeholder={placeholder}
        isValid={isValid}
        sampleData={sampleData}
        errorMessages={errorMessages}
        isSqlImport={isSqlImport}
        disabled={disabled}
        multiline={multiline}
        onFieldChange={handleFieldChange}
        extractFields={extractFields}
        lookups={lookupData}
        onLookupUpdate={handleLookupUpdate}
        required={required}
        connectionId={connectionId}
        value={extactedVal}
        connectionType={connection.type}
        resourceId={resourceId}
        resourceName={resourceName}
        resourceType={resourceType}
        flowId={flowId}
        getUpdatedFieldValue={getUpdatedFieldValue}
        prefixRegexp={prefixRegexp}
        getMatchedValueforSuggestion={getMatchedValueforSuggestion}
      />
    </Fragment>
  );
}
