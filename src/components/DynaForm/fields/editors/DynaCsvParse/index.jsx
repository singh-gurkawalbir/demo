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
  container: {
    width: '100%',
    paddingLeft: theme.spacing(1),
    paddingBottom: theme.spacing(1),
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
  const getInitOptions = useCallback(
    (val) => {
      if (!('trimSpaces' in val)) {
        return {...val, trimSpaces: true};
      }
      return val;
    },
    [],
  );
  const initOptions = useMemo(() => getInitOptions(value), [getInitOptions, value]);
  const [currentOptions, setCurrentOptions] = useState(initOptions);
  const [form, setForm] = useState(getFormMetadata({...initOptions, resourceId, resourceType}));
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
      const parsedVal = getParserValue(editorValues);
      setCurrentOptions(parsedVal);
      setForm(getFormMetadata({...editorValues, resourceId, resourceType}));
      setFormKey(formKey + 1);
      onFieldChange(id, parsedVal);

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

  const editorDataTitle = useMemo(
    () => {
      if (uploadSampleDataFieldName) {
        return (
          <DynaUploadFile
            resourceId={resourceId}
            resourceType={resourceType}
            onFieldChange={onFieldChange}
            options="csv"
            color=""
            placeholder="Sample CSV file (that would be parsed)"
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
      <div className={classes.container}>
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
            editorDataTitle={editorDataTitle}
            onSave={handleSave}
            onClose={handleEditorClick}
            disabled={disabled}
          />
        )}
        <div className={classes.labelWrapper}>
          <FormLabel className={classes.label}>{label}</FormLabel>
          <FieldHelp {...props} />
        </div>
        <Button
          data-test={id}
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
        optionsHandler={form?.optionsHandler}
        disabled={disabled}
        fieldMeta={form}
      />
    </>
  );
}
