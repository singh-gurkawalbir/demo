/* eslint-disable camelcase */
import React, { useEffect, useCallback, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, useRouteMatch } from 'react-router-dom';
import makeStyles from '@mui/styles/makeStyles';
import InputLabel from '@mui/material/InputLabel';
import { generateNewId } from '../../../../utils/resource';
import DynaText from '../DynaText';
import FieldHelp from '../../FieldHelp';
import { selectors } from '../../../../reducers';
import actions from '../../../../actions';
import LoadResources from '../../../LoadResources';
import { message } from '../../../../utils/messageStore';
import { drawerPaths, buildDrawerUrl } from '../../../../utils/rightDrawer';

import StackView from './StackView';
import ScriptView from './ScriptView';

const useStyles = makeStyles(theme => ({
  wrapper: {
    display: 'flex',
    alignItems: 'flex-start',
  },
  field: {
    width: '50%',
    paddingRight: theme.spacing(1),
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
  isLoggable,
  isValid = true,
  disablePortal = true,
}) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const match = useRouteMatch();
  const [newScriptId, setNewScriptId] = useState();
  const createdScriptId = useSelector(state =>
    selectors.createdResourceId(state, newScriptId)
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

  useEffect(() => {
    if (createdScriptId) {
      onFieldChange(id, { ...value, _scriptId: createdScriptId }, false);
    }
  }, [createdScriptId, id, onFieldChange, value]);

  // Below code is to make myapi resource form invalid if script or function is
  // not provided. If form is invalid, user can not save the resource.
  useEffect(() => {
    if (resourceType === 'apis') {
      const isValid = value.function && value._scriptId;

      if (isValid) {
        dispatch(actions.form.forceFieldState(formKey)(id, {isValid: true}));
      } else {
        dispatch(actions.form.forceFieldState(formKey)(id, {isValid: false, errorMessages: message.REQUIRED_MESSAGE}));
      }
    }
  }, [id, dispatch, formKey, value, resourceType]);

  const isValidHookField = useCallback(
    field => {
      const { function: func, _scriptId, _stackId } = value;
      const isEmptyHook = !func && !(_scriptId || _stackId);

      // If all fields are empty , then it is valid as we accept empty hook(except resource type apis)
      if (isEmptyHook) return required ? isValid : resourceType !== 'apis';

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
    [value, required, isValid, resourceType]
  );

  const addNewScript = () => {
    setNewScriptId(() => {
      const _newScriptId = generateNewId();

      history.push(buildDrawerUrl({
        path: drawerPaths.RESOURCE.ADD,
        baseUrl: match.url,
        params: { resourceType: 'scripts', id: _newScriptId },
      }));

      return _newScriptId;
    });
  };

  return (
    <LoadResources resources="scripts">
      <div className={classes.inputContainer}>
        <div className={classes.labelWithHelpTextWrapper}>
          <InputLabel>{label}</InputLabel>
          <FieldHelp disablePortal={disablePortal} label={propsLabel} helpKey={propsHelpKey} />
        </div>
        <div className={classes.wrapper}>
          <div className={classes.field}>
            <DynaText
              isLoggable={isLoggable}
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
              helpKey="api.function"
              disablePortal={false} />
          </div>
          {hookType === 'stack' && (
            <StackView
              isLoggable={isLoggable}
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
              isLoggable={isLoggable}
              onFieldChange={onFieldChange}
              required={required}
              value={value}
              formKey={formKey}
              hookStage={hookStage}
              resourceType={resourceType}
              resourceId={resourceId}
              isValidHookField={isValidHookField}
              handleFieldChange={handleFieldChange}
              handleCreateScriptClick={addNewScript}
               />
          )}
        </div>
      </div>
    </LoadResources>
  );
}
