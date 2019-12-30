import React, { useState, Fragment } from 'react';
import { TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import UrlEditorDialog from '../../../../components/AFE/UrlEditor/Dialog';
import InputWithLookupHandlebars from './InputWithLookupHandlebars';
import ActionButton from '../../../ActionButton';
import ExitIcon from '../../../icons/ExitIcon';
import { adaptorTypeMap } from '../../../../utils/resource';
import sampleTemplateUtil from '../../../../utils/sampleTemplate';

const useStyles = makeStyles(theme => ({
  textField: {
    minWidth: 200,
  },
  exitButton: {
    float: 'right',
    marginLeft: theme.spacing(1),
  },
}));
const prefixRegexp = '.*{{((?!(}|{)).)*$';

export default function TemplateEditor(props) {
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
    resourceName,
    sampleData,
    extractFields,
    connection,
    showLookup,
    fieldType,
    lookups,
    editorTitle = 'Relative URI Editor',
  } = props;
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

  let description = '';
  const { type } = connection || {};

  if (type === 'http' || type === 'rest') {
    description = `Relative to: ${connection[type].baseURI}`;
  }

  const extactedVal =
    options && typeof arrayIndex === 'number' && Array.isArray(value)
      ? value[arrayIndex]
      : value;
  const isSqlImport =
    adaptorType && adaptorTypeMap[adaptorType] === adaptorTypeMap.RDBMSImport;
  const getMatchedValueforSuggestion = (_val, cursorPosition) => {
    const inpValue = _val.substring(0, cursorPosition);
    const startIndexOfBraces = inpValue.lastIndexOf('{{');
    const matchedString = inpValue.substring(startIndexOfBraces + 2);

    return matchedString;
  };

  const getUpdatedFieldValue = (
    userInput,
    cursorPosition,
    insertedVal,
    isLookup
  ) => {
    const tmpStr = userInput.substring(0, cursorPosition);
    const lastIndexOfBracesBeforeCursor = tmpStr.lastIndexOf('{');
    let handlebarExp = '';

    if (isLookup && connection.type === 'http') {
      handlebarExp = `{lookup "${insertedVal}" this}`;
    } else {
      handlebarExp = `{${insertedVal}}`;
    }

    const closeBraceIndexAfterCursor = extactedVal.indexOf(
      '}',
      lastIndexOfBracesBeforeCursor + 1
    );
    const openBraceIndexAfterCursor = extactedVal.indexOf(
      '{',
      lastIndexOfBracesBeforeCursor + 1
    );
    let newValue = '';
    const preText = `${extactedVal.substring(
      0,
      lastIndexOfBracesBeforeCursor + 1
    )}`;

    if (
      closeBraceIndexAfterCursor === -1 ||
      (openBraceIndexAfterCursor !== -1 &&
        openBraceIndexAfterCursor < closeBraceIndexAfterCursor)
    ) {
      const postText = `${extactedVal.substring(
        lastIndexOfBracesBeforeCursor + 1
      )}`;

      newValue = `${preText}${handlebarExp}}}${postText}`;
    } else {
      const postText = `${extactedVal.substring(closeBraceIndexAfterCursor)}`;

      newValue = `${preText}${handlebarExp}${postText}`;
    }

    return newValue;
  };

  const editorRule =
    extactedVal || sampleTemplateUtil.getSampleRuleTemplate(adaptorType);

  return (
    <Fragment>
      {showEditor && (
        <UrlEditorDialog
          title={editorTitle}
          id={id}
          data={sampleData}
          rule={editorRule}
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
      {fieldType === 'relativeUri' && (
        <InputWithLookupHandlebars
          id={id}
          showLookup={showLookup}
          key={id}
          name={name}
          label={label}
          placeholder={placeholder}
          isValid={isValid}
          sampleData={sampleData}
          description={description}
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
      )}
      {fieldType === 'templateeditor' && (
        <TextField
          id={id}
          key={id}
          name={name}
          label={label}
          className={classes.textField}
          placeholder={placeholder}
          helperText={isValid ? description : errorMessages}
          disabled={disabled}
          required={required}
          error={!isValid}
          value={value}
          variant="filled"
          onChange={e => {
            const inpValue = e.target.value;

            handleFieldChange(id, inpValue);
          }}
        />
      )}
    </Fragment>
  );
}
