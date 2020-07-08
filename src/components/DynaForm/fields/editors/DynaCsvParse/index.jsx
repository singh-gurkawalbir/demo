import React, { useState, useMemo, useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button, FormLabel } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import * as selectors from '../../../../../reducers';
import actions from '../../../../../actions';
import CsvConfigEditorDialog from '../../../../AFE/CsvConfigEditor/Dialog';
import FieldHelp from '../../../FieldHelp';
import DynaUploadFile from '../../DynaUploadFile';
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
  columnDelimiter,
  rowDelimiter,
  hasHeaderRow,
  keyColumns,
  rowsToSkip,
  trimSpaces
}) => {
  const rules = {
    columnDelimiter,
    rowDelimiter,
    hasHeaderRow,
    keyColumns,
    trimSpaces
  };
  if (typeof rowsToSkip !== 'undefined') {
    rules.rowsToSkip = Number.isInteger(rowsToSkip) ? rowsToSkip : 0;
  }
  return rules;
};

export default function DynaCsvParse(props) {
  const classes = useStyles();
  const {
    id,
    onFieldChange,
    label,
    value,
    resourceId,
    resourceType,
    disabled,
    helpKey,
    options = {}
  } = props;
  const { uploadSampleDataFieldName} = options;
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

  const dispatch = useDispatch();
  /*
   * Fetches Raw data - CSV file to be parsed based on the rules
   */
  const csvData = useSelector(state => selectors.fileSampleData(state, {
    resourceId, resourceType, fileType: 'csv'
  }));

  const handleSave = (shouldCommit, editorValues = {}) => {
    if (shouldCommit) {
      setForm(getFormMetadata({...editorValues, resourceId, resourceType}));
      setFormKey(formKey + 1);
      const value = getParserValue(editorValues);
      onFieldChange(id, value);

      // when keyColumn is supported
      if (typeof editorValues.keyColumns !== 'undefined' && editorValues?.keyColumns?.length) {
        dispatch(
          actions.sampleData.request(
            resourceId,
            resourceType,
            {
              type: 'csv',
              file: csvData,
              editorValues,
            },
            'file'
          )
        );
      }
    }
  };

  const uploadFileAction = useMemo(
    () => {
      if (uploadSampleDataFieldName) {
        return (
          <DynaUploadFile
            resourceId={resourceId}
            resourceType={resourceType}
            onFieldChange={onFieldChange}
            options="csv"
            placeholder="Sample file (that would be parsed)"
            id={uploadSampleDataFieldName}
            persistData
          />
        );
      }
    },

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [uploadSampleDataFieldName]
  );
  return (
    <>
      <div className={classes.csvContainer}>
        {showEditor && (
          <CsvConfigEditorDialog
            title="CSV parser helper"
            id={`csvParser-${id}-${resourceId}`}
            mode="csv"
            data={csvData}
            resourceType={resourceType}
            csvEditorType="parse"
            // /** rule to be passed as json */
            // rule={rule}
            rule={currentOptions}
            uploadFileAction={uploadFileAction}
            onSave={handleSave}
            onClose={handleEditorClick}
            disabled={disabled}
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
