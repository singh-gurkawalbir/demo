/* eslint-disable camelcase */
import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, useRouteMatch } from 'react-router-dom';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import { generateNewId } from '../../../../utils/resource';
import DynaSelect from '../DynaSelect';
import DynaText from '../DynaText';
import FieldHelp from '../../FieldHelp';
import { selectors } from '../../../../reducers';
import EditIcon from '../../../icons/EditIcon';
import AddIcon from '../../../icons/AddIcon';
import CreateScriptDialog from './CreateScriptDialog';
import { saveScript } from './utils';
import ActionButton from '../../../ActionButton';
import useSelectorMemo from '../../../../hooks/selectors/useSelectorMemo';
import { getValidRelativePath } from '../../../../utils/routePaths';
import actions from '../../../../actions';
import EditorDrawer from '../../../AFE2/Drawer';
import LoadResources from '../../../LoadResources';
import { REQUIRED_MESSAGE } from '../../../../utils/form/validation';

const useStyles = makeStyles(theme => ({
  wrapper: {
    display: 'flex',
  },
  field: {
    width: '50%',
    paddingRight: theme.spacing(1),
    overflow: 'hidden',
    '& >.MuiFormControl-root': {
      width: '100%',
    },
    '&:last-child': {
      paddingRight: 0,
    },
  },
  hookActionBtnAdd: {
    marginLeft: 0,
    alignSelf: 'flex-start',
    marginTop: theme.spacing(4),
  },
  hookActionBtnEdit: {
    marginLeft: theme.spacing(1),
  },
  labelWithHelpTextWrapper: {
    flexDirection: 'row',
    display: 'flex',
    alignItems: 'flex-start',
    minWidth: 100,
    marginTop: 10,
    marginBottom: 10,
  },
}));

const scriptsFilterConfig = { type: 'scripts' };
const stacksFilterConfig = { type: 'stacks' };

export default function DynaHook_afe2({
  id,
  flowId,
  disabled,
  name,
  onFieldChange,
  placeholder,
  required,
  value = {},
  label,
  formKey,
  hookType = 'script',
  hookStage = 'preSavePage',
  resourceType,
  resourceId,
  label: propsLabel,
  helpKey: propsHelpKey,
}) {
  const classes = useStyles();
  const history = useHistory();
  const match = useRouteMatch();
  const dispatch = useDispatch();
  const editorId = getValidRelativePath(id);

  const [showCreateScriptDialog, setShowCreateScriptDialog] = useState(false);
  const [tempScriptId, setTempScriptId] = useState(generateNewId());
  const [isNewScriptIdAssigned, setIsNewScriptIdAssigned] = useState(false);
  const createdScriptId = useSelector(state =>
    selectors.createdResourceId(state, tempScriptId)
  );
  const allScripts = useSelectorMemo(
    selectors.makeResourceListSelector,
    scriptsFilterConfig
  ).resources;
  const allStacks = useSelectorMemo(
    selectors.makeResourceListSelector,
    stacksFilterConfig
  ).resources;

  const handleSave = useCallback(editorValues => {
    const { scriptId, entryFunction } = editorValues.rule;

    onFieldChange(id, {
      ...value,
      _scriptId: scriptId,
      function: entryFunction,
    });
  }, [id, onFieldChange, value]);

  const handleEditorClick = useCallback(() => {
    dispatch(actions._editor.init(editorId, 'javascript', {
      flowId,
      resourceId,
      resourceType,
      formKey: resourceType === 'apis' && formKey, // we need formkey only for apis resource type
      stage: hookStage,
      rule: value,
      onSave: handleSave,
    }));

    history.push(`${match.url}/editor/${editorId}`);
  }, [dispatch, editorId, flowId, resourceId, resourceType, hookStage, history, match.url, value, handleSave, formKey]);

  const handleFieldChange = field => (event, fieldValue) => {
    // Incase user selects scripts/stacks list to 'None' for which fieldValue is '' , we remove function name if entered any
    // if functionToBeEmptied is true, in onFieldChange we update function prop to empty
    const functionToBeEmptied =
      ['_scriptId', '_stackId'].includes(field) && !fieldValue;

    onFieldChange(id, {
      ...value,
      [field]: fieldValue,
      ...(functionToBeEmptied ? { function: '' } : {}),
    });
  };

  const handleCreateScriptClick = () => {
    setTempScriptId(generateNewId());
    setIsNewScriptIdAssigned(false);
    setShowCreateScriptDialog(true);
  };

  const handleCreateScriptSave = useCallback(values => {
    const options = { dispatch, isNew: true };

    saveScript({ ...values, scriptId: tempScriptId }, options, { flowId });
  }, [dispatch, flowId, tempScriptId]);

  const handleCreateScriptDialogClose = useCallback(() => {
    setShowCreateScriptDialog(false);
  }, []);

  useEffect(() => {
    if (createdScriptId && !isNewScriptIdAssigned) {
      onFieldChange(id, { ...value, _scriptId: createdScriptId }, true);
      setIsNewScriptIdAssigned(true);
    }
  }, [
    createdScriptId,
    handleEditorClick,
    id,
    isNewScriptIdAssigned,
    onFieldChange,
    value,
  ]);

  const allScriptsOptions = allScripts.map(script => ({
    label: script.name,
    value: script._id,
  }));
  const allStacksOptions = allStacks.map(stack => ({
    label: stack.name,
    value: stack._id,
  }));

  // Below code is to make myapi resource form invalid if script or function is
  // not provided. If form is invalid, user can not save the resource.
  useEffect(() => {
    if (resourceType === 'apis') {
      const isValid = value.function && value._scriptId;

      if (isValid) {
        dispatch(actions.form.forceFieldState(formKey)(id, {isValid: true}));
      } else {
        dispatch(actions.form.forceFieldState(formKey)(id, {isValid: false, errorMessages: REQUIRED_MESSAGE}));
      }
    }
  }, [id, dispatch, formKey, value, resourceType]);

  const isValidHookField = useCallback(
    field => {
      const { function: func, _scriptId, _stackId } = value;
      const isEmptyHook = !func && !(_scriptId || _stackId);

      // If all fields are empty , then it is valid as we accept empty hook(except resource type apis)
      if (isEmptyHook) return resourceType !== 'apis';

      // If hook is not empty, then valid if those respective fields are not empty
      switch (field) {
        case 'function':
          return !!func;
        case '_scriptId':
          return !!_scriptId;
        case '_stackId':
          return !!_stackId;
        default:
      }
    },
    [value, resourceType]
  );

  return (
    <>
      <LoadResources resources="scripts">
        {showCreateScriptDialog && (
        <CreateScriptDialog
          onClose={handleCreateScriptDialogClose}
          onSave={handleCreateScriptSave}
          scriptId={tempScriptId}
          flowId={flowId}
        />
        )}

        <div className={classes.inputContainer}>
          <div className={classes.labelWithHelpTextWrapper}>
            <InputLabel>{label}</InputLabel>
            <FieldHelp label={propsLabel} helpKey={propsHelpKey} />
          </div>
          <div className={classes.wrapper}>
            <div className={classes.field}>
              <DynaText
                key={id}
                name={name}
                label="Function"
                InputLabelProps={{
                  shrink: true,
                }}
                placeholder={placeholder}
                disabled={disabled}
                required={required}
                isValid={isValidHookField('function')}
                value={value.function}
                onFieldChange={handleFieldChange('function')}
            />
            </div>
            {hookType === 'stack' && (
            <div className={classes.field}>
              <FormControl className={classes.select}>
                <InputLabel htmlFor="stackId">Stack</InputLabel>
                <DynaSelect
                  id="stackId"
                  label="Stacks"
                  value={value._stackId}
                  placeholder="None"
                  disabled={disabled}
                  required={required}
                  isValid={isValidHookField('_stackId')}
                  onFieldChange={handleFieldChange('_stackId')}
                  options={[{ items: allStacksOptions || [] }]}
                />
              </FormControl>
            </div>
            )}
            {hookType === 'script' && (
            <>
              <div className={classes.field}>
                <FormControl className={classes.select}>
                  <InputLabel htmlFor="scriptId">Script</InputLabel>
                  <DynaSelect
                    id="scriptId"
                    label="Scripts"
                    value={value._scriptId}
                    disabled={disabled}
                    placeholder="None"
                    required={required}
                    isValid={isValidHookField('_scriptId')}
                    onFieldChange={handleFieldChange('_scriptId')}
                    options={[{ items: allScriptsOptions || [] }]}
                  />
                </FormControl>
              </div>
              <ActionButton
                onClick={handleCreateScriptClick}
                disabled={disabled}
                className={classes.hookActionBtnAdd}
                data-test={id}>
                <AddIcon />
              </ActionButton>
            </>
            )}
            {hookType === 'script' && (
            <ActionButton
              onClick={handleEditorClick}
              disabled={disabled || !value._scriptId}
              className={clsx(
                classes.hookActionBtnAdd,
                classes.hookActionBtnEdit
              )}
              data-test={id}>
              <EditIcon />
            </ActionButton>
            )}
          </div>
        </div>
      </LoadResources>
      <EditorDrawer />
    </>
  );
}
