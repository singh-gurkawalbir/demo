import React, { useState, useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button, FormLabel } from '@material-ui/core';
import DynaEditorWithFlowSampleData from '../../DynaEditorWithFlowSampleData';
import FieldHelp from '../../../FieldHelp';
import getFormMetadata from './metadata';
import DynaForm from '../../..';

const useStyles = makeStyles(theme => ({
  csvContainer: {
    flexDirection: 'row !important',
    width: '100%',
    alignItems: 'center',
  },
  csvBtn: {
    marginRight: theme.spacing(0.5),
  },
  csvLabel: {
    marginBottom: 0,
    marginRight: 12,
    maxWidth: '50%',
    wordBreak: 'break-word',
  },
}));

const getParserValue = ({
  includeHeader,
  columnDelimiter,
  rowDelimiter,
  replaceNewlineWithSpace,
  replaceTabWithSpace,
  truncateLastRowDelimiter,
  wrapWithQuotes,
}) => {
  const rules = {
    includeHeader,
    columnDelimiter,
    rowDelimiter,
    replaceNewlineWithSpace,
    replaceTabWithSpace,
    truncateLastRowDelimiter,
    wrapWithQuotes,
  };
  return rules;
};

export default function DynaCsvGenerata(props) {
  const classes = useStyles();
  const {
    id,
    onFieldChange,
    label,
    value,
    resourceId,
    resourceType,
    disabled,
    flowId,
    helpKey,
  } = props;
  const [formKey, setFormKey] = useState(1);
  const [currentOptions, setCurrentOptions] = useState(getParserValue({...value, resourceId, resourceType}));
  const [form, setForm] = useState(getFormMetadata({...value, resourceId, resourceType}));
  const [showEditor, setShowEditor] = useState(false);
  const handleFormChange = useCallback(
    (newOptions, isValid) => {
      setCurrentOptions({...newOptions});
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
  const handleEditorClick = () => {
    setShowEditor(!showEditor);
  };

  const handleSave = (shouldCommit, editorValues = {}) => {
    if (shouldCommit) {
      setForm(getFormMetadata({...editorValues, resourceId, resourceType}));
      setFormKey(formKey + 1);
      const value = getParserValue(editorValues);
      onFieldChange(id, value);
    }
  };

  return (
    <>
      <div className={classes.csvContainer}>
        {showEditor && (
          <DynaEditorWithFlowSampleData
            title="CSV generator helper"
            id={`csvGenerate-${id}-${resourceId}`}
            mode="csv"
            csvEditorType="generate"
          /** rule to be passed as json */
            rule={currentOptions}
            onSave={handleSave}
            onClose={handleEditorClick}
            disabled={disabled}
            flowId={flowId}
            editorType="csvGenerate"
            resourceId={resourceId}
            resourceType={resourceType}
            fieldId="file.csv"
        />
        )}
        <FormLabel className={classes.csvLabel}>{label}</FormLabel>
        <Button
          data-test={id}
          variant="outlined"
          color="secondary"
          className={classes.csvBtn}
          onClick={handleEditorClick}>
          Launch
        </Button>
        <FieldHelp {...props} helpKey={helpKey} />
      </div>
      <DynaForm
        key={formKey}
        onChange={handleFormChange}
        optionsHandler={form?.optionsHandler}
        disabled={disabled}
        fieldMeta={form}
      />
    </>
  );
}
