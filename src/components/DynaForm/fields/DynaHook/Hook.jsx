import { useState, Fragment, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import { isFunction } from 'lodash';
import shortid from 'shortid';
import DynaSelect from '../DynaSelect';
import DynaText from '../DynaText';
import * as selectors from '../../../../reducers';
import JavaScriptEditorDialog from '../../../../components/AFE/JavaScriptEditor/Dialog';
import EditIcon from '../../../icons/EditIcon';
import AddIcon from '../../../icons/AddIcon';
import CreateScriptDialog from './CreateScriptDialog';
import { saveScript } from './utils';

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
  textField: {
    width: 'calc(50% - 30px)',
    paddingRight: theme.spacing(1),
  },
  editorButton: {
    marginLeft: 5,
    background: theme.palette.background.paper,
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
    height: 50,
    width: 50,
    borderRadius: 2,
    color: theme.palette.text.hint,
    '&:hover': {
      background: theme.palette.background.paper,
      '& > span': {
        color: theme.palette.primary.main,
      },
    },
  },
}));

export default function DynaHook(props) {
  const [showEditor, setShowEditor] = useState(false);
  const [showCreateScriptDialog, setShowCreateScriptDialog] = useState(false);
  const getNewId = () => `new-${shortid.generate()}`;
  const [tempScriptId, setTempScriptId] = useState(getNewId());
  const [isNewScriptIdAssigned, setIsNewScriptIdAssigned] = useState(false);
  const classes = useStyles();
  const dispatch = useDispatch();
  const createdScriptId = useSelector(state =>
    selectors.createdResourceId(state, tempScriptId)
  );
  const { resources: allScripts } = useSelector(state =>
    selectors.resourceList(state, { type: 'scripts' })
  );
  const { resources: allStacks } = useSelector(state =>
    selectors.resourceList(state, { type: 'stacks' })
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
    setTempScriptId(getNewId());
    setIsNewScriptIdAssigned(false);
    setShowCreateScriptDialog(true);
  };

  const handleCreateScriptDialogClose = (shouldCommit, values) => {
    if (shouldCommit) {
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
          data={JSON.stringify(preHookData, null, 2)}
          scriptId={value._scriptId}
          entryFunction={value.function}
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
          <div className={classes.textField}>
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
            // Todo Azhar select field is small
            <FormControl className={classes.select}>
              <InputLabel htmlFor="stackId">Stack</InputLabel>
              <DynaSelect
                id="stackId"
                value={value._stackId}
                onFieldChange={handleFieldChange('_stackId')}
                options={[{ items: allStacksOptions || [] }]}
              />
            </FormControl>
          )}
          {hookType === 'script' && (
            <Fragment>
              <FormControl className={classes.select}>
                <InputLabel htmlFor="scriptId">Script</InputLabel>
                <DynaSelect
                  id="scriptId"
                  value={value._scriptId}
                  onFieldChange={handleFieldChange('_scriptId')}
                  options={[{ items: allScriptsOptions || [] }]}
                />
              </FormControl>
              <IconButton
                onClick={handleCreateScriptClick}
                className={classes.editorButton}
                data-test={id}>
                <AddIcon />
              </IconButton>
            </Fragment>
          )}
          {hookType === 'script' && value._scriptId && (
            <IconButton
              onClick={handleEditorClick}
              className={classes.editorButton}
              data-test={id}>
              <EditIcon />
            </IconButton>
          )}
        </div>
      </div>
    </Fragment>
  );
}
