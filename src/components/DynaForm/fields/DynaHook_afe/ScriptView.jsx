/* eslint-disable camelcase */
import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory, useRouteMatch } from 'react-router-dom';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import DynaSelect from '../DynaSelect';
import { selectors } from '../../../../reducers';
import EditIcon from '../../../icons/EditIcon';
import AddIcon from '../../../icons/AddIcon';
import ActionButton from '../../../ActionButton';
import useSelectorMemo from '../../../../hooks/selectors/useSelectorMemo';
import { getValidRelativePath } from '../../../../utils/routePaths';
import actions from '../../../../actions';

const useStyles = makeStyles(theme => ({
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
}));

const scriptsFilterConfig = { type: 'scripts' };

export default function ScriptView({
  id,
  flowId,
  disabled,
  onFieldChange,
  required,
  value = {},
  formKey,
  hookStage = 'preSavePage',
  resourceType,
  resourceId,
  isValidHookField,
  handleFieldChange,
  handleCreateScriptClick,
}) {
  const classes = useStyles();
  const history = useHistory();
  const match = useRouteMatch();
  const dispatch = useDispatch();
  const editorId = getValidRelativePath(id);

  const allScripts = useSelectorMemo(
    selectors.makeResourceListSelector,
    scriptsFilterConfig
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
    dispatch(actions.editor.init(editorId, 'javascript', {
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

  const allScriptsOptions = allScripts.map(script => ({
    label: script.name,
    value: script._id,
  }));

  return (
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
    </>
  );
}
