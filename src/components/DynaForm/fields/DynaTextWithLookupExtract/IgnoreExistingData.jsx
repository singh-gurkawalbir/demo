import React, { useState, Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import UrlEditorDialog from '../../../../components/AFE/UrlEditor/Dialog';
import InputWithLookupHandlebars from './InputWithLookupHandlebars';
import ActionButton from '../../../ActionButton';
import ExitIcon from '../../../icons/ExitIcon';
import { adaptorTypeMap } from '../../../../utils/resource';

const useStyles = makeStyles(theme => ({
  textField: {
    minWidth: 200,
  },
  exitButton: {
    float: 'right',
    marginLeft: theme.spacing(1),
  },
}));
// match all characters
const prefixRegexp = '(.*?)';

export default function IgnoreExistingData(props) {
  const [showEditor, setShowEditor] = useState(false);
  const classes = useStyles();
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
  const handleEditorClick = () => {
    setShowEditor(!showEditor);
  };

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

  const handleClose = (shouldCommit, editorValues) => {
    const { template } = editorValues;

    if (shouldCommit) {
      handleFieldChange(id, template);
    }

    handleEditorClick();
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
      {showEditor && (
        <UrlEditorDialog
          title="Relative URI Editor"
          id={id}
          data={sampleData}
          rule={extactedVal}
          lookups={lookupData}
          onClose={handleClose}
        />
      )}
      <ActionButton
        data-test={id}
        onClick={handleEditorClick}
        className={classes.exitButton}>
        <ExitIcon />
      </ActionButton>
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
