import { useState, Fragment, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { isFunction } from 'lodash';
import shortid from 'shortid';
import * as selectors from '../../../../reducers';
import JavaScriptEditorDialog from '../../../../components/AFE/JavaScriptEditor/Dialog';
import EditIcon from '../../../icons/EditIcon';
import AddIcon from '../../../icons/AddIcon';
import ArrowDownIcon from '../../../icons/ArrowDownIcon';
import CreateScriptDialog from './CreateScriptDialog';
import { saveScript } from './utils';

const useStyles = makeStyles(theme => ({
  select: {
    display: 'flex !important',
    flexWrap: 'nowrap',
    background: theme.palette.background.paper,
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
    transitionProperty: 'border',
    transitionDuration: theme.transitions.duration.short,
    transitionTimingFunction: theme.transitions.easing.easeInOut,
    overflow: 'hidden',
    height: 50,
    width: '50%',
    justifyContent: 'flex-end',
    borderRadius: 2,
    '& > Label': {
      marginTop: theme.spacing(-1),
      '&.MuiInputLabel-shrink': {
        paddingTop: theme.spacing(2),
      },
    },
    '&:hover': {
      borderColor: theme.palette.primary.main,
    },
    '& > *': {
      padding: [[0, 12]],
      background: 'none',
    },
    '& > div > div ': {
      paddingBottom: 5,
    },
    '& svg': {
      right: theme.spacing(1),
      top: theme.spacing(-1),
    },
  },
  wrapper: {
    display: 'flex',
    alignItems: 'flex-start',
    marginBottom: 6,
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

  const handleFieldChange = field => event => {
    onFieldChange(id, { ...value, [field]: event.target.value });
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
          <TextField
            key={id}
            name={name}
            label="Function"
            InputLabelProps={{
              shrink: true,
            }}
            className={classes.textField}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            error={!isValid}
            value={value.function}
            variant="filled"
            onChange={handleFieldChange('function')}
          />
          {hookType === 'stack' && (
            <FormControl className={classes.select}>
              <InputLabel htmlFor="stackId">Stack</InputLabel>
              <Select
                id="stackId"
                margin="dense"
                variant="filled"
                value={value._stackId}
                onChange={handleFieldChange('_stackId')}>
                {allStacks.map(s => (
                  <MenuItem key={s._id} value={s._id}>
                    {s.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
          {hookType === 'script' && (
            <Fragment>
              <FormControl className={classes.select}>
                <InputLabel htmlFor="scriptId">Script</InputLabel>
                <Select
                  id="scriptId"
                  margin="dense"
                  variant="filled"
                  value={value._scriptId}
                  IconComponent={ArrowDownIcon}
                  onChange={handleFieldChange('_scriptId')}>
                  {allScripts.map(s => (
                    <MenuItem key={s._id} value={s._id}>
                      {s.name}
                    </MenuItem>
                  ))}
                </Select>
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
