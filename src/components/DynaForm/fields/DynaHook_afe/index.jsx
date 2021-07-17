/* eslint-disable camelcase */
import React, { useEffect, useCallback, useReducer } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import { generateNewId } from '../../../../utils/resource';
import DynaText from '../DynaText';
import FieldHelp from '../../FieldHelp';
import { selectors } from '../../../../reducers';
import CreateScriptDialog from './CreateScriptDialog';
import { saveScript } from './utils';
import actions from '../../../../actions';
import LoadResources from '../../../LoadResources';
import { REQUIRED_MESSAGE } from '../../../../utils/messageStore';
import hookReducer from './stateReducer';
import StackView from './StackView';
import ScriptView from './ScriptView';

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
  labelWithHelpTextWrapper: {
    flexDirection: 'row',
    display: 'flex',
    alignItems: 'flex-start',
    minWidth: 100,
    marginTop: 10,
    marginBottom: 10,
  },
}));

export default function DynaHook_afe({
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
  dataPublic,
}) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [hookState, setHookState] = useReducer(hookReducer, {showCreateScriptDialog: false, tempScriptId: generateNewId(), isNewScriptIdAssigned: false });

  const createdScriptId = useSelector(state =>
    selectors.createdResourceId(state, hookState.tempScriptId)
  );

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
    setHookState({ type: 'setTempScriptId', value: generateNewId() });
    setHookState({ type: 'setIsNewScriptIdAssigned', value: false });
    setHookState({ type: 'setShowCreateScriptDialog', value: true });
  };

  const handleCreateScriptSave = useCallback((values, formKey) => {
    const options = { dispatch, isNew: true };

    saveScript({ ...values, scriptId: hookState.tempScriptId }, options, { flowId }, formKey);
  }, [dispatch, flowId, hookState.tempScriptId]);

  const handleCreateScriptDialogClose = useCallback(() => {
    setHookState({ type: 'setShowCreateScriptDialog', value: false });
  }, []);

  useEffect(() => {
    if (createdScriptId && !hookState.isNewScriptIdAssigned) {
      onFieldChange(id, { ...value, _scriptId: createdScriptId }, false);
      setHookState({ type: 'setIsNewScriptIdAssigned', value: true });
    }
  }, [createdScriptId, hookState.isNewScriptIdAssigned, id, onFieldChange, value]);

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
        {hookState.showCreateScriptDialog && (
        <CreateScriptDialog
          onClose={handleCreateScriptDialogClose}
          onSave={handleCreateScriptSave}
          scriptId={hookState.tempScriptId}
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
                dataPublic={dataPublic}
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
            <StackView
              dataPublic={dataPublic}
              disabled={disabled}
              required={required}
              stackId={value?._stackId}
              handleFieldChange={handleFieldChange}
              isValidHookField={isValidHookField}
            />
            )}
            {hookType === 'script' && (
            <ScriptView
              id={id}
              flowId={flowId}
              disabled={disabled}
              dataPublic={dataPublic}
              onFieldChange={onFieldChange}
              required={required}
              value={value}
              formKey={formKey}
              hookStage={hookStage}
              resourceType={resourceType}
              resourceId={resourceId}
              isValidHookField={isValidHookField}
              handleFieldChange={handleFieldChange}
              handleCreateScriptClick={handleCreateScriptClick}
               />
            )}
          </div>
        </div>
      </LoadResources>
    </>
  );
}
