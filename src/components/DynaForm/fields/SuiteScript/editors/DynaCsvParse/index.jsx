import React, { useState, useMemo, useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button, FormLabel } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import * as selectors from '../../../../../../reducers';
import actions from '../../../../../../actions';
import FieldHelp from '../../../../FieldHelp';
import getFormMetadata from './metadata';
import CsvConfigEditorDialog from '../../../../../AFE/SuiteScript/CsvConfigEditor/Dialog';
import DynaForm from '../../../..';
import DynaSuiteScriptUploadFile from '../../../DynaSuiteScriptUploadFile';

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
}));

const getParserValue = ({
  columnDelimiter,
  rowDelimiter,
  hasHeaderRow,
  keyColumns,
}) => ({
  columnDelimiter,
  rowDelimiter,
  hasHeaderRow,
  keyColumns,
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
    ssLinkedConnectionId,
    uploadSampleDataFieldName
  } = props;
  const [formKey, setFormKey] = useState(1);
  const [currentOptions, setCurrentOptions] = useState(value);
  const [form, setForm] = useState(getFormMetadata({...value, resourceId, resourceType}));
  const [showEditor, setShowEditor] = useState(false);
  const handleFormChange = useCallback(
    (newOptions, isValid) => {
      setCurrentOptions(newOptions);
      const parsersValue = getParserValue(newOptions);
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
  const csvData = useSelector(state => {
    const { data: rawData, status } = selectors.getResourceSampleDataWithStatus(
      state,
      resourceId,
      'raw'
    );

    if (!status) {
      // Incase of resource edit and no file uploaded, show the csv content uploaded last time ( sampleData )
      const resource = selectors.suiteScriptResource(state, {
        resourceType,
        id: resourceId,
        ssLinkedConnectionId,
      });

      // If the file type is csv before , only then retrieve its content sampleData to show in the editor
      if (
        resource &&
        resource.export &&
        resource.export.file &&
        resource.export.file.csv
      ) {
        return resource.export.sampleData;
      }
    }

    return rawData && rawData.body;
  });

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
          <DynaSuiteScriptUploadFile
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
