import React, { useState, useMemo, useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button, FormLabel } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import { selectors } from '../../../../../reducers';
import actions from '../../../../../actions';
import CsvConfigEditorDrawer from '../../../../AFE/CsvConfigEditor/Drawer';
import FieldHelp from '../../../FieldHelp';
import DynaUploadFile from '../../DynaUploadFile';
import getFormMetadata from './metadata';
import DynaForm from '../../..';
import usePushRightDrawer from '../../../../../hooks/usePushRightDrawer';
import {useUpdateParentForm} from '../DynaCsvGenerate';
import { generateNewId } from '../../../../../utils/resource';
import useFormInitWithPermissions from '../../../../../hooks/useFormInitWithPermissions';
import useSetSubFormShowValidations from '../../../../../hooks/useSetSubFormShowValidations';

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
  fileUploadBtnLabel: {
    fontSize: 17,
  },
}));

const getParserValue = ({
  columnDelimiter,
  rowDelimiter,
  hasHeaderRow,
  keyColumns,
  rowsToSkip,
  trimSpaces,
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
    uploadSampleDataFieldName,
    formKey: parentFormKey,
  } = props;
  const [remountKey, setRemountKey] = useState(1);
  const getInitOptions = useCallback(
    val => {
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
  const handleOpenDrawer = usePushRightDrawer(id);

  const handleFormChange = useCallback(
    (newOptions, isValid, touched) => {
      setCurrentOptions(newOptions);
      // console.log('optionsChange', newOptions);
      const parsersValue = getParserValue(newOptions);

      // TODO: HACK! add an obscure prop to let the validationHandler defined in
      // the formFactory.js know that there are child-form validation errors
      if (!isValid) {
        onFieldChange(id, { ...parsersValue, __invalid: true }, touched);
      } else {
        onFieldChange(id, parsersValue, touched);
      }
    },
    [id, onFieldChange]
  );

  const dispatch = useDispatch();
  /*
   * Fetches Raw data - CSV file to be parsed based on the rules
   */
  const csvData = useSelector(state => selectors.fileSampleData(state, {
    resourceId, resourceType, fileType: 'csv',
  }));

  const handleSave = useCallback((shouldCommit, editorValues = {}) => {
    if (shouldCommit) {
      const parsedVal = getParserValue(editorValues);

      setCurrentOptions(parsedVal);
      setForm(getFormMetadata({...editorValues, resourceId, resourceType}));
      setRemountKey(remountKey => remountKey + 1);
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
  }, [csvData, dispatch, id, onFieldChange, resourceId, resourceType]);

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
                label: classes.fileUploadBtnLabel,
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

  const [secondaryFormKey] = useState(generateNewId());

  useUpdateParentForm(secondaryFormKey, handleFormChange);
  useSetSubFormShowValidations(parentFormKey, secondaryFormKey);
  const formKeyComponent = useFormInitWithPermissions({
    formKey: secondaryFormKey,
    remount: remountKey,
    optionsHandler: form?.optionsHandler,
    disabled,
    fieldMeta: form,
  });

  return (
    <>
      <div className={classes.container}>
        <CsvConfigEditorDrawer
          title={label}
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
          disabled={disabled}
          path={id}
          />

        <div className={classes.labelWrapper}>
          <FormLabel className={classes.label}>{label}</FormLabel>
          <FieldHelp {...props} />
        </div>
        <Button
          data-test={id}
          variant="outlined"
          color="secondary"
          className={classes.button}
          onClick={handleOpenDrawer}>
          Launch
        </Button>

      </div>
      <DynaForm
        formKey={formKeyComponent}
        fieldMeta={form}
      />
    </>
  );
}
