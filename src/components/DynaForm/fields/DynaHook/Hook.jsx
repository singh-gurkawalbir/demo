import { useState, Fragment, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import { isFunction } from 'lodash';
import { generateNewId } from '../../../../utils/resource';
import { hooksToFunctionNamesMap } from '../../../../utils/hooks';
import DynaSelect from '../DynaSelect';
import DynaText from '../DynaText';
import * as selectors from '../../../../reducers';
import JavaScriptEditorDialog from '../../../../components/AFE/JavaScriptEditor/Dialog';
import EditIcon from '../../../icons/EditIcon';
import AddIcon from '../../../icons/AddIcon';
import CreateScriptDialog from './CreateScriptDialog';
import { saveScript } from './utils';
import ActionButton from '../../../ActionButton';

const useStyles = makeStyles(theme => ({
  wrapper: {
    display: 'flex',
    alignItems: 'flex-start',
  },
  label: {
    minWidth: 100,
    marginTop: 10,
    marginBottom: 10,
  },
  field: {
    width: '50%',
    paddingRight: theme.spacing(1),
    '& >.MuiFormControl-root': {
      width: '100%',
    },
  },
}));

export default function DynaHook(props) {
  const [showEditor, setShowEditor] = useState(false);
  const [showCreateScriptDialog, setShowCreateScriptDialog] = useState(false);
  const [tempScriptId, setTempScriptId] = useState(generateNewId());
  const [isNewScriptIdAssigned, setIsNewScriptIdAssigned] = useState(false);
  const classes = useStyles();
  const dispatch = useDispatch();
  const createdScriptId = useSelector(state =>
    selectors.createdResourceId(state, tempScriptId)
  );
  const allScripts = useSelector(
    state => selectors.resourceList(state, { type: 'scripts' }).resources
  );
  const allStacks = useSelector(
    state => selectors.resourceList(state, { type: 'stacks' }).resources
  );
  const {
    id,
    disabled,
    isValid,
    name,
    onFieldChange,
    placeholder,
    required,
    value = {},
    label,
    hookType = 'script',
    hookStage = 'preSavePage',
    preHookData = {},
    requestForPreHookData,
  } = props;
  const handleEditorClick = useCallback(() => {
    if (requestForPreHookData && isFunction(requestForPreHookData)) {
      requestForPreHookData();
    }

    setShowEditor(!showEditor);
  }, [requestForPreHookData, showEditor]);
  const handleClose = (shouldCommit, editorValues) => {
    const { scriptId, entryFunction, code: content } = editorValues;

    if (shouldCommit) {
      const values = { content, scriptId };

      saveScript(values, { dispatch });
      onFieldChange(id, {
        ...value,
        _scriptId: scriptId,
        function: entryFunction,
      });
    }

    handleEditorClick();
  };

  const handleFieldChange = field => (event, fieldValue) => {
    onFieldChange(id, { ...value, [field]: fieldValue });
  };

  const handleCreateScriptClick = () => {
    setTempScriptId(generateNewId());
    setIsNewScriptIdAssigned(false);
    setShowCreateScriptDialog(true);
  };

  const handleCreateScriptDialogClose = (shouldCommit, values) => {
    if (shouldCommit === true) {
      const options = { dispatch, isNew: true };

      saveScript({ ...values, scriptId: tempScriptId }, options);
    }

    setShowCreateScriptDialog(false);
  };

  useEffect(() => {
    if (createdScriptId && !isNewScriptIdAssigned) {
      onFieldChange(id, { ...value, _scriptId: createdScriptId });
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

  return (
    <Fragment>
      {showEditor && (
        <JavaScriptEditorDialog
          title="Script Editor"
          id={id}
          key={id}
          disabled={disabled}
          data={JSON.stringify(preHookData, null, 2)}
          scriptId={value._scriptId}
          entryFunction={value.function || hooksToFunctionNamesMap[hookStage]}
          onClose={handleClose}
        />
      )}
      {showCreateScriptDialog && (
        <CreateScriptDialog
          onClose={handleCreateScriptDialogClose}
          scriptId={tempScriptId}
        />
      )}

      <div className={classes.inputContainer}>
        <InputLabel className={classes.label}>{label}</InputLabel>
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
              error={!isValid}
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
                  disabled={disabled}
                  onFieldChange={handleFieldChange('_stackId')}
                  options={[{ items: allStacksOptions || [] }]}
                />
              </FormControl>
            </div>
          )}
          {hookType === 'script' && (
            <Fragment>
              <div className={classes.field}>
                <FormControl className={classes.select}>
                  <InputLabel htmlFor="scriptId">Script</InputLabel>
                  <DynaSelect
                    id="scriptId"
                    label="Scripts"
                    value={value._scriptId}
                    disabled={disabled}
                    onFieldChange={handleFieldChange('_scriptId')}
                    options={[{ items: allScriptsOptions || [] }]}
                  />
                </FormControl>
              </div>
              <ActionButton
                onClick={handleCreateScriptClick}
                disabled={disabled}
                data-test={id}>
                <AddIcon />
              </ActionButton>
            </Fragment>
          )}
          {hookType === 'script' && value._scriptId && (
            <ActionButton
              onClick={handleEditorClick}
              disabled={disabled}
              data-test={id}>
              <EditIcon />
            </ActionButton>
          )}
        </div>
      </div>
    </Fragment>
  );
}
