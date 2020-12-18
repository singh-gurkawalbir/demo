import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button, FormLabel } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { selectors } from '../../../../../reducers';
import FieldHelp from '../../../FieldHelp';
import getFormMetadata from '../DynaCsvGenerate/metadata';
import DynaForm from '../../..';
import useFormInitWithPermissions from '../../../../../hooks/useFormInitWithPermissions';
import { generateNewId } from '../../../../../utils/resource';
import useFormContext from '../../../../Form/FormContext';
import useSetSubFormShowValidations from '../../../../../hooks/useSetSubFormShowValidations';
import { getValidRelativePath } from '../../../../../utils/routePaths';
import actions from '../../../../../actions';

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

// resourceId and resourceType are not saved on form doc
const getParserValue = ({customHeaderRows, resourceId, resourceType, ...rest}) => ({
  ...rest,
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
export default function _DynaCsvGenerate_(props) {
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
  const dispatch = useDispatch();
  const history = useHistory();
  const match = useRouteMatch();
  const secondaryFormKey = useRef(generateNewId());
  const editorId = getValidRelativePath(id);

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
  const [form, setForm] = useState(getFormMetadata({...initOptions, customHeaderRowsSupported: isHttpImport}));
  const handleFormChange = useCallback(
    (newOptions, isValid, touched) => {
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

  const handleSave = useCallback((editorValues = {}) => {
    const { rule } = editorValues;
    const parsedVal = getParserValue(rule);

    setForm(getFormMetadata({...rule, customHeaderRowsSupported: isHttpImport}));
    setRemountKey(remountKey => remountKey + 1);
    onFieldChange(id, parsedVal);
  }, [id, isHttpImport, onFieldChange]);

  useUpdateParentForm(secondaryFormKey.current, handleFormChange);
  useSetSubFormShowValidations(parentFormKey, secondaryFormKey.current);
  const formKeyComponent = useFormInitWithPermissions({
    formKey: secondaryFormKey.current,
    remount: remountKey,
    optionsHandler: form?.optionsHandler,
    disabled,
    fieldMeta: form,
  });

  const handleEditorClick = useCallback(() => {
    dispatch(actions._editor.init(editorId, 'csvGenerator', {
      formKey: parentFormKey,
      flowId,
      resourceId,
      resourceType,
      fieldId: id,
      stage: 'flowInput',
      onSave: handleSave,
    }));

    history.push(`${match.url}/editor/${editorId}`);
  }, [dispatch, id, parentFormKey, flowId, resourceId, resourceType, handleSave, history, match.url, editorId]);

  return (
    <>
      <div className={classes.csvContainer}>
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
        formKey={formKeyComponent}
        fieldMeta={form}
      />
    </>
  );
}
