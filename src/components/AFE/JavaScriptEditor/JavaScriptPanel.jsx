import React, { useEffect, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { TextField, FormLabel, MenuItem, FormControl, Button } from '@material-ui/core';
import LoadResources from '../../LoadResources';
import CodePanel from '../GenericEditor/CodePanel';
import actions from '../../../actions';
import { selectors } from '../../../reducers';
import { hooksLabelMap, getScriptHookStub } from '../../../utils/hooks';
import useSelectorMemo from '../../../hooks/selectors/useSelectorMemo';
import CeligoSelect from '../../CeligoSelect';
import Spinner from '../../Spinner';

const useStyles = makeStyles(theme => ({
  container: {
    backgroundColor: theme.palette.background.default,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  textField: {
    marginTop: '0px !important',
  },
  scriptPanel: {
    width: '100%',
    height: '100%',
  },
  headerContainer: {
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
    padding: theme.spacing(0.5),
    '& > *:nth-child(n)': {
      width: '100%',
    },
  },
  jsPanelFormControl: {
    width: '100%',
    paddingRight: theme.spacing(0.5),
  },
  btnAction: {
    marginTop: theme.spacing(3),
  },
}));
const scriptFilterConfig = { type: 'scripts' };

export default function JavaScriptPanel(props) {
  const { editorId, disabled, insertStubKey, errorLine, hasError } = props;
  const classes = useStyles(props);
  const aceEditor = useRef(null);
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
    const editor = aceEditor.current;
    const pos = editor?.getCursorPosition();

    // Fetches stub and insert it at the cursor position
    editor?.session?.insert(pos, getScriptHookStub(insertStubKey));
  }, [insertStubKey]);

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

  const handleAceEditorLoad = useCallback(e => {
    aceEditor.current = e;
  }, []);
  const menuProps = {
    PaperProps: {
      style: {
        maxWidth: 320,
        wordBreak: 'break-word',
      },

    },
  };

  return (
    <LoadResources required resources={['scripts']}>
      <div className={classes.container}>
        <div data-public className={classes.headerContainer}>
          <FormControl className={classes.jsPanelFormControl}>
            <FormLabel htmlFor="scriptId">
              Script
            </FormLabel>
            <CeligoSelect
              id="scriptId"
              margin="dense"
              value={scriptId}
              className={classes.textField}
              displayEmpty
              disabled={disabled}
              MenuProps={menuProps}
              onChange={handleScriptChange}>
              {[defaultItem, ...scriptOptions]}
            </CeligoSelect>
          </FormControl>
          <FormControl className={classes.jsPanelFormControl}>
            <FormLabel htmlFor="entryFunction">
              Function
            </FormLabel>
            <TextField
              id="entryFunction"
              disabled={disabled}
              variant="filled"
              className={classes.textField}
              value={entryFunction}
              onChange={event =>
                patchEditor({ entryFunction: event.target.value })}
          />
          </FormControl>
          {scriptId && insertStubKey && (
            <Button
              variant="outlined"
              color="secondary"
              className={classes.btnAction}
              onClick={handleInsertStubClick}
              disabled={disabled}
              data-test={insertStubKey}>
              {`Insert ${hooksLabelMap[insertStubKey].toLowerCase()} stub`}
            </Button>
          )}
        </div>
        <div className={classes.scriptPanel}>
          {scriptContent === undefined && scriptId ? (
            <Spinner centerAll />
          ) : (
            <CodePanel
              name="code"
              id="code"
              readOnly={disabled}
              value={code}
              mode="javascript"
              onChange={handleCodeChange}
              errorLine={errorLine}
              hasError={hasError}
              onLoad={handleAceEditorLoad}
            />
          )}
        </div>
      </div>
    </LoadResources>
  );
}
