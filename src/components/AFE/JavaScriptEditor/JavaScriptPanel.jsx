import React, { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
import LoadResources from '../../LoadResources';
import CodePanel from '../GenericEditor/CodePanel';
import actions from '../../../actions';
import * as selectors from '../../../reducers';
import PanelLoader from '../../PanelLoader';
import { hooksLabelMap, getScriptHookStub } from '../../../utils/hooks';
import useSelectorMemo from '../../../hooks/selectors/useSelectorMemo';

const useStyles = makeStyles(theme => ({
  container: {
    backgroundColor: theme.palette.background.default,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  textField: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    // Changing this from 50% to 33% to accomodate 3 elements
    // TODO:@Azhar Make this flexible layout to fix  multiple elements instead of having width
    width: '33%',
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
  },
  label: {
    paddingLeft: theme.spacing(1),
  },
  scriptPanel: {
    width: '100%',
    height: '100%',
  },
}));
const scriptFilterConfig = { type: 'scripts' };

export default function JavaScriptPanel(props) {
  const { editorId, disabled, insertStubKey } = props;
  const classes = useStyles(props);
  const editor = useSelector(state => selectors.editor(state, editorId));
  const {
    code = '',
    fetchScriptContent = false,
    entryFunction = '',
    scriptId = '',
  } = editor;
  const data = useSelectorMemo(
    selectors.makeResourceDataSelector,
    'scripts',
    scriptId
  );
  const scriptContent = data && data.merged && data.merged.content;
  const allScripts = useSelectorMemo(
    selectors.makeResourceListSelector,
    scriptFilterConfig
  ).resources;
  const dispatch = useDispatch();
  const patchEditor = useCallback(
    val => {
      dispatch(actions.editor.patch(editorId, val));
    },
    [dispatch, editorId]
  );
  const requestScript = useCallback(() => {
    dispatch(actions.resource.request('scripts', scriptId));
  }, [dispatch, scriptId]);
  const handleCodeChange = useCallback(code => patchEditor({ code }), [
    patchEditor,
  ]);
  const handleScriptChange = useCallback(
    event => {
      if (!event.target.value) {
        return patchEditor({
          scriptId: '',
          code: '',
          entryFunction: '',
        });
      }

      patchEditor({ scriptId: event.target.value, fetchScriptContent: true });
    },
    [patchEditor]
  );
  const handleInsertStubClick = useCallback(() => {
    // Fetches stub and appends it to current script content
    const updatedScriptContent = code + getScriptHookStub(insertStubKey);

    // Updated this new script content on editor
    patchEditor({ code: updatedScriptContent });
  }, [code, insertStubKey, patchEditor]);

  useEffect(() => {
    if (fetchScriptContent && scriptContent !== undefined) {
      const patchObj = {
        code: scriptContent,
        fetchScriptContent: false,
      };

      // check if initCode property existings in editor. If no, save a copy of copy as _init_code for dirty checking
      if (!('_init_code' in editor)) patchObj._init_code = scriptContent;

      patchEditor(patchObj);
    } else if (scriptContent === undefined && scriptId) {
      requestScript();
    } else if (scriptId === undefined && !('_init_code' in editor)) {
      // case of scriptId selected as none
      patchEditor({ _init_code: undefined });
    }
  }, [
    code,
    editor,
    editorId,
    fetchScriptContent,
    patchEditor,
    requestScript,
    scriptContent,
    scriptId,
  ]);
  const defaultItem = (
    <MenuItem key="__placeholder" value="">
      None
    </MenuItem>
  );
  const scriptOptions = allScripts.map(s => (
    <MenuItem key={s._id} value={s._id}>
      {s.name}
    </MenuItem>
  ));

  return (
    <LoadResources required resources={['scripts']}>
      <div className={classes.container}>
        <div>
          <FormControl className={classes.textField}>
            <InputLabel className={classes.label} htmlFor="scriptId">
              Script
            </InputLabel>
            <Select
              id="scriptId"
              margin="dense"
              value={scriptId}
              displayEmpty
              disabled={disabled}
              onChange={handleScriptChange}>
              {[defaultItem, ...scriptOptions]}
            </Select>
          </FormControl>
          <TextField
            id="entryFunction"
            disabled={disabled}
            InputLabelProps={{ className: classes.label }}
            className={classes.textField}
            value={entryFunction}
            onChange={event =>
              patchEditor({ entryFunction: event.target.value })}
            label="Function"
            margin="dense"
          />
          {scriptId && insertStubKey && (
            <Button
              variant="contained"
              color="primary"
              className={classes.textField}
              onClick={handleInsertStubClick}
              disabled={disabled}
              data-test={insertStubKey}>
              {`Insert ${hooksLabelMap[insertStubKey].toLowerCase()} stub`}
            </Button>
          )}
        </div>
        <div className={classes.scriptPanel}>
          {scriptContent === undefined && scriptId ? (
            // Removed retrieving message to make it consistent as we do not show specific messages
            // pass message if need to show any
            <PanelLoader />
          ) : (
            <CodePanel
              name="code"
              id="code"
              readOnly={disabled}
              value={code}
              mode="javascript"
              onChange={handleCodeChange}
            />
          )}
        </div>
      </div>
    </LoadResources>
  );
}
