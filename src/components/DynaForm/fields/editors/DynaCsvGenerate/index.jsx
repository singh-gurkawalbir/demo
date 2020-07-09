import React, { useState, useCallback, useMemo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button, FormLabel } from '@material-ui/core';
import { useSelector } from 'react-redux';
import * as selectors from '../../../../../reducers';
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
  const initOptions = useMemo(() => {
    const {customHeaderRows, ...others} = value;
    const opts = {...others, resourceId, resourceType};
    opts.customHeaderRows = isHttpImport && customHeaderRows?.join('\n');
    return opts;
  }, [isHttpImport, resourceId, resourceType, value]);
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
      setForm(getFormMetadata({...editorValues, customHeaderRowsSupported: isHttpImport}));
      setFormKey(formKey + 1);
      onFieldChange(id, getParserValue(editorValues));
    }
  }, [formKey, id, isHttpImport, onFieldChange]);

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
        <FieldHelp {...props} />
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
