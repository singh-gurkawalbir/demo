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
  fileUploadLabelWrapper: {
    width: '100%',
    marginTop: 'auto',
    marginBottom: 'auto'

  },
  fileUploadRoot: {
    width: '100%',
  },
  actionContainer: {
    display: 'flex',
    flexDirection: 'row'

  },
  uploadContainer: {
    justifyContent: 'flex-end',
    background: 'transparent !important',
    border: '0px !important',
    width: 'auto !important',
    padding: 4
  },
  uploadFileErrorContainer: {
    marginBottom: 4
  }
});

const getParserValue = ({
  columnDelimiter,
  rowDelimiter,
  hasHeaderRow,
  keyColumns,
  rowsToSkip,
  trimSpaces
}) => ({
  columnDelimiter,
  rowDelimiter,
  hasHeaderRow,
  keyColumns,
  trimSpaces,
  rowsToSkip: Number.isInteger(rowsToSkip) ? rowsToSkip : 0,
});

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
    uploadSampleDataFieldName
  } = props;
  const [formKey, setFormKey] = useState(1);
  const [currentOptions, setCurrentOptions] = useState(value);
  const [form, setForm] = useState(getFormMetadata({...value, resourceId, resourceType}));
  const [showEditor, setShowEditor] = useState(false);
  const handleFormChange = useCallback(
    (newOptions, isValid) => {
      setCurrentOptions(newOptions);
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
  const handleEditorClick = useCallback(() => {
    setShowEditor(!showEditor);
  }, [showEditor]);

  const dispatch = useDispatch();
  /*
   * Fetches Raw data - CSV file to be parsed based on the rules
   */
  const csvData = useSelector(state => selectors.fileSampleData(state, {
    resourceId, resourceType, fileType: 'csv'
  }));

  const handleSave = useCallback((shouldCommit, editorValues = {}) => {
    if (shouldCommit) {
      setForm(getFormMetadata({...editorValues, resourceId, resourceType}));
      setFormKey(formKey + 1);
      const value = getParserValue(editorValues);
      onFieldChange(id, value);

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
  }, [csvData, dispatch, formKey, id, onFieldChange, resourceId, resourceType]);

  const uploadFileAction = useMemo(
    () => {
      if (uploadSampleDataFieldName) {
        return (
          <DynaUploadFile
            resourceId={resourceId}
            resourceType={resourceType}
            onFieldChange={onFieldChange}
            options="csv"
            placeholder="Sample CSV file (that would be parsed)"
            id={uploadSampleDataFieldName}
            persistData
            showFileNameWithLabel
            classProps={
              {
                root: classes.fileUploadRoot,
                labelWrapper: classes.fileUploadLabelWrapper,
                uploadFile: classes.uploadContainer,
                actionContainer: classes.actionContainer,
                errorContainer: classes.uploadFileErrorContainer
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
