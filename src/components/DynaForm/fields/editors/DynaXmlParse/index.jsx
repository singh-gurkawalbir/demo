/* eslint-disable camelcase */ // V0_json is a schema field. cant change.
import React, { useState, useCallback, useMemo } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { makeStyles, Button, FormLabel } from '@material-ui/core';
import { useSelector } from 'react-redux';
import * as selectors from '../../../../../reducers';
import XmlParseEditorDrawer from '../../../../AFE/XmlParseEditor/Drawer';
import DynaForm from '../../..';
import DynaUploadFile from '../../DynaUploadFile';
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
    stripNewLineChars,
  };

  if (attributePrefix) rules.attributePrefix = attributePrefix;
  if (textNodeName) rules.textNodeName = textNodeName;
  if (listNodes && typeof listNodes.split === 'function') rules.listNodes = listNodes.split('\n');
  if (includeNodes && typeof includeNodes.split === 'function') rules.includeNodes = includeNodes.split('\n');
  if (excludeNodes && typeof excludeNodes.split === 'function') rules.excludeNodes = excludeNodes.split('\n');

  const value = [
    {
      type: 'xml',
      version: 1,
      rules,
    },
  ];

  // This value is not actually part of the `parsers` schema, but we
  // need to place it somewhere such that the parent form preSave can find
  // it and properly add it to the exports.file.xml.resourcePath schema field.
  value.resourcePath = resourcePath;

  return value;
};

const useStyles = makeStyles(theme => ({
  container: {
    width: '100%',
    paddingLeft: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  launchContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  button: {
    maxWidth: 100,
  },
  label: {
    marginBottom: 6,
  },
  labelWrapper: {
    display: 'flex',
    alignItems: 'flex-start',
  },
  fileUploadLabelWrapper: {
    width: '100%',
    marginTop: 'auto',
    marginBottom: 'auto',

  },
  fileUploadRoot: {
    width: '100%',
  },
  actionContainer: {
    display: 'flex',
    flexDirection: 'row',

  },
  uploadContainer: {
    justifyContent: 'flex-end',
    background: 'transparent !important',
    border: '0px !important',
    width: 'auto !important',
    padding: 4,
  },
  uploadFileErrorContainer: {
    marginBottom: 4,
  },
}));

export default function DynaXmlParse({
  id,
  value,
  onFieldChange,
  resourceId,
  resourceType,
  disabled,
  uploadSampleDataFieldName,
}) {
  const classes = useStyles();
  const [formKey, setFormKey] = useState(1);
  const history = useHistory();
  const match = useRouteMatch();
  const resourcePath = useSelector(state =>
    selectors.resource(state, resourceType, resourceId)?.file?.xml?.resourcePath);
  const getInitOptions = useCallback(
    val => ({ resourcePath, ...val?.[0]?.rules}),
    [resourcePath],
  );
  const options = useMemo(() => getInitOptions(value), [getInitOptions, value]);
  const [form, setForm] = useState(getForm(options));
  const [currentOptions, setCurrentOptions] = useState(options);
  const data = useSelector(state =>
    selectors.fileSampleData(state, { resourceId, resourceType, fileType: 'xml'}));

  const handleEditorClick = useCallback(() => {
    history.push(`${match.url}/${id}`);
  }, [history, id, match.url]);

  const handleEditorSave = useCallback((shouldCommit, editorValues = {}) => {
    // console.log(shouldCommit, editorValues);

    if (shouldCommit) {
      const parsersValue = getParserValue(editorValues);

      setCurrentOptions(getInitOptions(parsersValue));

      setForm(getForm(editorValues));
      setFormKey(formKey + 1);
      onFieldChange(id, parsersValue);
    }
  }, [formKey, getInitOptions, id, onFieldChange]);

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
  const editorDataTitle = useMemo(
    () => {
      if (uploadSampleDataFieldName) {
        return (
          <DynaUploadFile
            resourceId={resourceId}
            resourceType={resourceType}
            onFieldChange={onFieldChange}
            options="xml"
            color=""
            placeholder="Sample XML file (that would be parsed)"
            id={uploadSampleDataFieldName}
            persistData
            hideFileName
            variant="text"
            classProps={
              {
                root: classes.fileUploadRoot,
                labelWrapper: classes.fileUploadLabelWrapper,
                uploadFile: classes.uploadContainer,
                actionContainer: classes.actionContainer,
                errorContainer: classes.uploadFileErrorContainer,
              }
            }
          />
        );
      }
    },

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [uploadSampleDataFieldName]
  );

  return (
    <>
      <div className={classes.container}>
        <XmlParseEditorDrawer
          title="XML parser helper"
          id={id + resourceId}
          data={data}
          resourceType={resourceType}
          rule={currentOptions}
          onSave={handleEditorSave}
          disabled={disabled}
          editorDataTitle={editorDataTitle}
          path={id}
        />

        <div className={classes.labelWrapper}>
          <FormLabel className={classes.label}>XML parser helper</FormLabel>
          <FieldHelp label="Live parser" helpText="The live parser will give you immediate feedback on how your parse options are applied against your raw XML data." />
        </div>
        <Button
          data-test={`parse-helper-${id}`}
          variant="outlined"
          color="secondary"
          className={classes.button}
          onClick={handleEditorClick}>
          Launch
        </Button>
      </div>

      <DynaForm
        key={formKey}
        onChange={handleFormChange}
        disabled={disabled}
        fieldMeta={form}
      />
    </>
  );
}
