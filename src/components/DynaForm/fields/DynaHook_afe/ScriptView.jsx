/* eslint-disable camelcase */
import React, { useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory, useRouteMatch } from 'react-router-dom';
import clsx from 'clsx';
import makeStyles from '@mui/styles/makeStyles';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import DynaSelect from '../DynaSelect';
import { selectors } from '../../../../reducers';
import EditIcon from '../../../icons/EditIcon';
import AddIcon from '../../../icons/AddIcon';
import useSelectorMemo from '../../../../hooks/selectors/useSelectorMemo';
import { getValidRelativePath } from '../../../../utils/routePaths';
import actions from '../../../../actions';
import { buildDrawerUrl, drawerPaths } from '../../../../utils/rightDrawer';
import IconButtonWithTooltip from '../../../IconButtonWithTooltip';

const useStyles = makeStyles(theme => ({
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
  hookActionBtnAdd: {
    marginLeft: 0,
    alignSelf: 'flex-start',
    padding: 0,
    marginTop: theme.spacing(4),
  },
  hookActionBtnEdit: {
    marginLeft: theme.spacing(1),
  },
}));

const scriptsFilterConfig = { type: 'scripts' };
const emptyObj = {};
const emptyList = [];

export default function ScriptView({
  id,
  flowId,
  disabled,
  onFieldChange,
  required,
  value = emptyObj,
  formKey,
  hookStage = 'preSavePage',
  resourceType,
  resourceId,
  isValidHookField,
  handleFieldChange,
  handleCreateScriptClick,
  isLoggable,
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

    history.push(buildDrawerUrl({
      path: drawerPaths.EDITOR,
      baseUrl: match.url,
      params: { editorId },
    }));
  }, [dispatch, editorId, flowId, resourceId, resourceType, hookStage, history, match.url, value, handleSave, formKey]);

  const options = useMemo(() => [{ items: allScripts.map(script => ({
    label: script.name,
    value: script._id,
  })) || emptyList }], [allScripts]);

  return (
    <>
      <div className={classes.field}>
        <FormControl variant="standard" className={classes.select}>
          <InputLabel htmlFor="scriptId">Script</InputLabel>
          <DynaSelect
            id="scriptId"
            label="Scripts"
            value={value._scriptId}
            disabled={disabled}
            isLoggable={isLoggable}
            placeholder="None"
            required={required}
            isValid={isValidHookField('_scriptId')}
            onFieldChange={handleFieldChange('_scriptId')}
            options={options}
            helpKey="api.scripts"
            disablePortal={false} />
        </FormControl>
      </div>
      <IconButtonWithTooltip
        onClick={handleCreateScriptClick}
        tooltipProps={{title: 'Create script'}}
        disabled={disabled}
        className={classes.hookActionBtnAdd}
        data-test={id}>
        <AddIcon />
      </IconButtonWithTooltip>
      <IconButtonWithTooltip
        onClick={handleEditorClick}
        tooltipProps={{title: 'Edit script'}}
        disabled={disabled || !value._scriptId}
        className={clsx(
          classes.hookActionBtnAdd,
          classes.hookActionBtnEdit
        )}
        data-test={id}>
        <EditIcon />
      </IconButtonWithTooltip>
    </>
  );
}
