import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import { isFunction } from 'lodash';
import { generateNewId } from '../../../../utils/resource';
import { hooksToFunctionNamesMap } from '../../../../utils/hooks';
import DynaSelect from '../DynaSelect';
import DynaText from '../DynaText';
import FieldHelp from '../../FieldHelp';
import { selectors } from '../../../../reducers';
import JavaScriptEditorDrawer from '../../../AFE/JavaScriptEditor/Drawer';
import EditIcon from '../../../icons/EditIcon';
import AddIcon from '../../../icons/AddIcon';
import CreateScriptDialog from './CreateScriptDialog';
import { saveScript } from './utils';
import ActionButton from '../../../ActionButton';
import useSelectorMemo from '../../../../hooks/selectors/useSelectorMemo';
import usePushRightDrawer from '../../../../hooks/usePushRightDrawer';

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
/*
 * pass patchOnSave = true along with processorKey, if network save is required on click of Save button
 */
const scriptsFilterConfig = { type: 'scripts' };
const stacksFilterConfig = { type: 'stacks' };

export default function DynaHook(props) {
  const handleOpenDrawer = usePushRightDrawer();
  const [showCreateScriptDialog, setShowCreateScriptDialog] = useState(false);
  const [tempScriptId, setTempScriptId] = useState(generateNewId());
  const dispatch = useDispatch();
  const [isNewScriptIdAssigned, setIsNewScriptIdAssigned] = useState(false);
  const classes = useStyles();
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
  const {
    id,
    flowId,
    disabled,
    name,
    onFieldChange,
    placeholder,
    required,
    value = {},
    label,
    hookType = 'script',
    hookStage = 'preSavePage',
    preHookData = {},
    editorResultMode,
    requestForPreHookData,
    isSampleDataLoading,
    resourceType,
  } = props;
  const scriptContext = useSelector(state =>
    selectors.getScriptContext(state, {
      contextType: 'hook',
      flowId,
    })
  );
  const handleEditorClick = useCallback(() => {
    if (requestForPreHookData && isFunction(requestForPreHookData)) {
      requestForPreHookData();
    }

    handleOpenDrawer(id);
  }, [id, handleOpenDrawer, requestForPreHookData]);
  const handleSave = (shouldCommit, editorValues) => {
    if (shouldCommit) {
      const { scriptId, entryFunction } = editorValues;

      onFieldChange(id, {
        ...value,
        _scriptId: scriptId,
        function: entryFunction,
      });
    }
  };

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
  const optionalSaveParams = useMemo(
    () => ({
      processorKey: 'scriptEdit',
    }),
    []
  );

  return (
    <>
      <JavaScriptEditorDrawer
        title="Script editor"
        id={id}
        key={id}
        disabled={disabled}
        data={JSON.stringify(preHookData, null, 2)}
        scriptId={value._scriptId}
        insertStubKey={hookStage}
        entryFunction={value.function || hooksToFunctionNamesMap[hookStage]}
        context={scriptContext}
        onSave={handleSave}
        resultMode={editorResultMode}
        optionalSaveParams={optionalSaveParams}
        flowId={flowId}
        patchOnSave
        isSampleDataLoading={isSampleDataLoading}
        />
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
          <FieldHelp label={props.label} helpKey={props.helpKey} />
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
    </>
  );
}
