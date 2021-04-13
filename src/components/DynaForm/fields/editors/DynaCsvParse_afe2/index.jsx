/* eslint-disable camelcase */
import React, { useState, useMemo, useCallback, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button, FormLabel } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import { useHistory, useRouteMatch } from 'react-router-dom';
import actions from '../../../../../actions';
import FieldHelp from '../../../FieldHelp';
import getForm from '../../../../AFE2/Editor/panels/CsvParseRules/formMeta';
import DynaForm from '../../..';
import {useUpdateParentForm} from '../DynaCsvGenerate_afe2';
import { generateNewId } from '../../../../../utils/resource';
import useFormInitWithPermissions from '../../../../../hooks/useFormInitWithPermissions';
import useSetSubFormShowValidations from '../../../../../hooks/useSetSubFormShowValidations';
import { getValidRelativePath } from '../../../../../utils/routePaths';
import FileDataChange from './FileDataChange';

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
}));

// multipleRowsPerRecord is not saved on form doc
const getParserValue = ({rowsToSkip, multipleRowsPerRecord, ...rest}) => ({
  ...rest,
  rowsToSkip: Number.isInteger(rowsToSkip) ? rowsToSkip : 0,
});

export default function DynaCsvParse_afe2(props) {
  const {
    id,
    onFieldChange,
    label,
    value,
    resourceId,
    resourceType,
    disabled,
    formKey: parentFormKey,
    flowId,
  } = props;
  const classes = useStyles();
  const [remountKey, setRemountKey] = useState(1);
  const secondaryFormKey = useRef(generateNewId());
  const dispatch = useDispatch();
  const history = useHistory();
  const match = useRouteMatch();
  const editorId = getValidRelativePath(id);

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
  const [form, setForm] = useState(getForm({...initOptions, resourceId, resourceType}));

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

    setForm(getForm({...rule, resourceId, resourceType}));
    setRemountKey(remountKey => remountKey + 1);
    onFieldChange(id, parsedVal);

    // todo: @raghu removing this dispatch action from here as it will be taken care
    // by field change on the form itself. Please confirm and remove this comment
    // dispatch(
    //   actions.sampleData.request(
    //     resourceId,
    //     resourceType,
    //     {
    //       type: 'csv',
    //       // file: csvData,
    //       editorValues,
    //     },
    //     'file'
    //   )
    // );
  }, [id, onFieldChange, resourceId, resourceType]);

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
    dispatch(actions._editor.init(editorId, 'csvParser', {
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
      <div className={classes.container}>
        {/* todo: FileDataChange is a temporary hack until Raghu's changes are
        done re dispatching of SAMPLEDATA_UPDATED action to update editor sample data */}
        <FileDataChange editorId={editorId} fileType="csv" />
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
        formKey={formKeyComponent}
      />
    </>
  );
}
