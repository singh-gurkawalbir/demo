import React, { useState, useCallback, useMemo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button, FormLabel } from '@material-ui/core';
import { useSelector } from 'react-redux';
import * as selectors from '../../../../../reducers';
import DynaEditorWithFlowSampleData from '../../DynaEditorWithFlowSampleData';
import FieldHelp from '../../../FieldHelp';
import getFormMetadata from './metadata';
import DynaForm from '../../..';

const useStyles = makeStyles({
  csvContainer: {
    width: '100%',
  },
  csvBtn: {
    maxWidth: 100,
  },
  csvLabel: {
    marginBottom: 6,
  },
  csvLabelWrapper: {
    display: 'flex',
    alignItems: 'flex-start',
  },
});
const getParserValue = ({
  includeHeader,
  columnDelimiter,
  rowDelimiter,
  replaceNewlineWithSpace,
  replaceTabWithSpace,
  truncateLastRowDelimiter,
  wrapWithQuotes,
  customHeaderRows,
}) => ({
  includeHeader,
  columnDelimiter,
  rowDelimiter,
  replaceNewlineWithSpace,
  replaceTabWithSpace,
  truncateLastRowDelimiter,
  wrapWithQuotes,
  customHeaderRows: customHeaderRows?.split('\n').filter(val => val !== '')
});

export default function DynaCsvGenerate(props) {
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
  } = props;
  const [formKey, setFormKey] = useState(1);
  const isHttpImport = useSelector(state => {
    const {merged: resource = {}} = selectors.resourceData(state, resourceType, resourceId);
    return resource?.adaptorType === 'HTTPImport';
  });
  const getInitOptions = useCallback(
    (val) => {
      const {customHeaderRows = [], ...others} = val;
      const opts = {...others, resourceId, resourceType};
      if (isHttpImport) {
        opts.customHeaderRows = customHeaderRows?.join('\n');
      }
      return opts;
    },
    [isHttpImport, resourceId, resourceType],
  );
  const initOptions = useMemo(() => getInitOptions(value), [getInitOptions, value]);
  const [currentOptions, setCurrentOptions] = useState(initOptions);
  const [form, setForm] = useState(getFormMetadata({...initOptions, customHeaderRowsSupported: isHttpImport}));
  const [showEditor, setShowEditor] = useState(false);
  const handleFormChange = useCallback(
    (newOptions, isValid) => {
      setCurrentOptions({...newOptions, resourceId, resourceType });
      const parsersValue = getParserValue(newOptions);
      // TODO: HACK! add an obscure prop to let the validationHandler defined in
      // the formFactory.js know that there are child-form validation errors
      if (!isValid) {
        onFieldChange(id, { ...parsersValue, __invalid: true });
      } else {
        onFieldChange(id, parsersValue);
      }
    },
    [id, onFieldChange, resourceId, resourceType]
  );
  const handleEditorClick = () => {
    setShowEditor(!showEditor);
  };

  const handleSave = useCallback((shouldCommit, editorValues = {}) => {
    if (shouldCommit) {
      const parsedVal = getParserValue(editorValues);
      setCurrentOptions(getInitOptions(parsedVal));
      setForm(getFormMetadata({...editorValues, customHeaderRowsSupported: isHttpImport}));
      setFormKey(formKey + 1);
      onFieldChange(id, parsedVal);
    }
  }, [formKey, getInitOptions, id, isHttpImport, onFieldChange]);

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
        <div className={classes.csvLabelWrapper}>
          <FormLabel className={classes.csvLabel}>{label}</FormLabel>
          <FieldHelp {...props} />
        </div>
        <Button
          data-test={id}
          variant="outlined"
          color="secondary"
          className={classes.csvBtn}
          onClick={handleEditorClick}>
          Launch
        </Button>
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
