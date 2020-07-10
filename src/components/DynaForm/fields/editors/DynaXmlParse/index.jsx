/* eslint-disable camelcase */ // V0_json is a schema field. cant change.
import React, { useState, useCallback } from 'react';
import { makeStyles, Button, FormLabel } from '@material-ui/core';
import { useSelector } from 'react-redux';
import * as selectors from '../../../../../reducers';
import XmlParseEditorDialog from '../../../../AFE/XmlParseEditor/Dialog';
import DynaForm from '../../..';
import FieldHelp from '../../../FieldHelp';
import getForm from './formMeta';

const getParserValue = ({
  resourcePath,
  V0_json,
  attributePrefix,
  trimSpaces,
  stripNewLineChars,
  textNodeName,
  listNodes,
  includeNodes,
  excludeNodes}) => {
  const rules = {
    V0_json: V0_json === 'true',
    trimSpaces,
    stripNewLineChars
  };

  if (attributePrefix) rules.attributePrefix = attributePrefix;
  if (textNodeName) rules.textNodeName = textNodeName;
  if (listNodes) rules.listNodes = listNodes.split('\n');
  if (includeNodes) rules.includeNodes = includeNodes.split('\n');
  if (excludeNodes) rules.excludeNodes = excludeNodes.split('\n');

  const value = [
    {
      type: 'xml',
      version: 1,
      rules
    },
  ];

  // This value is not actually part of the `parsers` schema, but we
  // need to place it somewhere such that the parent form preSave can find
  // it and properly add it to the exports.file.xml.resourcePath schema field.
  value.resourcePath = resourcePath;

  return value;
};

const useStyles = makeStyles(theme => ({
  fullWidth: {
    width: '100%',
  },
  launchContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  button: {
    marginRight: theme.spacing(0.5),
  },
  label: {
    marginBottom: 0,
    marginRight: 12,
    maxWidth: '50%',
    wordBreak: 'break-word',
  },

}));

export default function DynaXmlParse({
  id,
  value,
  onFieldChange,
  resourceId,
  resourceType,
  disabled,
}) {
  const classes = useStyles();
  const [showEditor, setShowEditor] = useState(false);
  const [formKey, setFormKey] = useState(1);
  const resourcePath = useSelector(state =>
    selectors.resource(state, resourceType, resourceId)?.file?.xml?.resourcePath);
  const options = { resourcePath, ...value?.[0]?.rules};
  const [form, setForm] = useState(getForm(options));
  const [currentOptions, setCurrentOptions] = useState(options);
  const data = useSelector(state =>
    selectors.fileSampleData(state, { resourceId, resourceType, fileType: 'xml'}));

  const handleEditorClick = useCallback(() => {
    setShowEditor(!showEditor);
  }, [showEditor]);

  const handleEditorSave = useCallback((shouldCommit, editorValues = {}) => {
    // console.log(shouldCommit, editorValues);

    if (shouldCommit) {
      setForm(getForm(editorValues));
      setFormKey(formKey + 1);
      onFieldChange(id, getParserValue(editorValues));
    }
  }, [formKey, id, onFieldChange]);

  const handleEditorClose = useCallback(() => {
    setShowEditor(false);
  }, []);
  const handleFormChange = useCallback(
    (newOptions, isValid) => {
      setCurrentOptions({...newOptions, V0_json: newOptions.V0_json === 'true'});
      // console.log('optionsChange', newOptions);
      const parsersValue = getParserValue(newOptions);
      // TODO: HACK! add an obscure prop to let the validationHandler defined in
      // the formFactory.js know that there are child-form validation errors
      if (!isValid) {
        onFieldChange(id, { ...parsersValue, __invalid: true });
      } else {
        onFieldChange(id, parsersValue);
      }
    },
    [id, onFieldChange]
  );

  return (
    <div className={classes.fullWidth}>
      {showEditor && (
        <XmlParseEditorDialog
          title="XML parser helper"
          id={id + resourceId}
          data={data}
          resourceType={resourceType}
          rule={currentOptions}
          onSave={handleEditorSave}
          onClose={handleEditorClose}
          disabled={disabled}
        />
      )}
      <div className={classes.launchContainer}>
        <FormLabel className={classes.label}>XML parser helper</FormLabel>
        <Button
          data-test={`parse-helper-${id}`}
          variant="outlined"
          color="secondary"
          className={classes.button}
          onClick={handleEditorClick}>
          Launch
        </Button>
        <FieldHelp label="Live parser" helpText="The live parser will give you immediate feedback on how your parse options are applied against your raw XML data." />
      </div>
      <DynaForm
        key={formKey}
        onChange={handleFormChange}
        disabled={disabled}
        fieldMeta={form}
      />
    </div>
  );
}
