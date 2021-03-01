import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button, FormLabel } from '@material-ui/core';
import { useSelector } from 'react-redux';
import { selectors } from '../../../../../reducers';
import DynaEditorWithFlowSampleData from '../../DynaEditorWithFlowSampleData';
import FieldHelp from '../../../FieldHelp';
import getFormMetadata from './metadata';
import DynaForm from '../../..';
import usePushRightDrawer from '../../../../../hooks/usePushRightDrawer';
import useFormInitWithPermissions from '../../../../../hooks/useFormInitWithPermissions';
import { generateNewId } from '../../../../../utils/resource';
import useFormContext from '../../../../Form/FormContext';
import useSetSubFormShowValidations from '../../../../../hooks/useSetSubFormShowValidations';

const useStyles = makeStyles(theme => ({
  csvContainer: {
    width: '100%',
    marginBottom: theme.spacing(2),
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
  customHeaderRows: customHeaderRows?.split('\n').filter(val => val !== ''),
});
export const useUpdateParentForm = (secondaryFormKey, handleFormChange) => {
  const { value: secondaryFormValue, fields, isValid} = useFormContext(secondaryFormKey);

  useEffect(() => {
    if (secondaryFormValue) {
      const isFormTouched = Object.values(fields).some(val => val.touched);

      // skip updates till secondary form is touched
      handleFormChange(secondaryFormValue, isValid, !isFormTouched);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondaryFormValue, fields, isValid]);
};
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
    formKey: parentFormKey,
  } = props;
  const [remountKey, setRemountKey] = useState(1);
  const handleOpenDrawer = usePushRightDrawer(id);

  const isHttpImport = useSelector(state => {
    const {merged: resource = {}} = selectors.resourceData(state, resourceType, resourceId);

    return resource?.adaptorType === 'HTTPImport';
  });
  const getInitOptions = useCallback(
    val => {
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
  const handleFormChange = useCallback(
    (newOptions, isValid, touched) => {
      setCurrentOptions({...newOptions, resourceId, resourceType });
      const parsersValue = getParserValue(newOptions);

      // TODO: HACK! add an obscure prop to let the validationHandler defined in
      // the formFactory.js know that there are child-form validation errors
      if (!isValid) {
        onFieldChange(id, { ...parsersValue, __invalid: true }, touched);
      } else {
        onFieldChange(id, parsersValue, touched);
      }
    },
    [id, onFieldChange, resourceId, resourceType]
  );

  const handleSave = useCallback((shouldCommit, editorValues = {}) => {
    if (shouldCommit) {
      const parsedVal = getParserValue(editorValues);

      setCurrentOptions(getInitOptions(parsedVal));
      setForm(getFormMetadata({...editorValues, customHeaderRowsSupported: isHttpImport}));
      setRemountKey(remountKey => remountKey + 1);
      onFieldChange(id, parsedVal);
    }
  }, [getInitOptions, id, isHttpImport, onFieldChange]);

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
      <div className={classes.csvContainer}>
        <DynaEditorWithFlowSampleData
          formKey={parentFormKey}
          title={label}
          id={`csvGenerate-${id}-${resourceId}`}
          mode="csv"
          csvEditorType="generate"
          /** rule to be passed as json */
          rule={currentOptions}
          onSave={handleSave}
          disabled={disabled}
          flowId={flowId}
          editorType="csvGenerate"
          resourceId={resourceId}
          resourceType={resourceType}
          fieldId="file.csv"
          path={id}
        />

        <div className={classes.csvLabelWrapper}>
          <FormLabel className={classes.csvLabel}>{label}</FormLabel>
          <FieldHelp {...props} />
        </div>
        <Button
          data-test={id}
          variant="outlined"
          color="secondary"
          className={classes.csvBtn}
          onClick={handleOpenDrawer}>
          Launch
        </Button>
      </div>
      <DynaForm
        formKey={formKeyComponent}
      />
    </>
  );
}
