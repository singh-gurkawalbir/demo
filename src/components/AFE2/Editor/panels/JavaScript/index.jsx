import clsx from 'clsx';
import React, { useEffect, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles,
  TextField,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  Button } from '@material-ui/core';
import shallowEqual from 'react-redux/lib/utils/shallowEqual';
import LoadResources from '../../../../LoadResources';
import CodePanel from '../Code';
import actions from '../../../../../actions';
import { selectors } from '../../../../../reducers';
import PanelLoader from '../../../../PanelLoader';
import { hooksLabelMap, getScriptHookStub } from '../../../../../utils/hooks';
import useSelectorMemo from '../../../../../hooks/selectors/useSelectorMemo';

const useStyles = makeStyles(theme => ({
  container: {
    backgroundColor: theme.palette.background.default,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  formControls: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: theme.spacing(0, 1),
  },
  textField: {
    flexGrow: 1,
    marginRight: theme.spacing(1),
  },
  entryFn: {
    marginBottom: theme.spacing(1),
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

export default function JavaScriptPanel({ editorId }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const aceEditor = useRef(null);
  const rule = useSelector(state => selectors._editorRule(state, editorId));
  const disabled = useSelector(state => selectors.isEditorDisabled(state, editorId));
  const {code = '', entryFunction = '', scriptId = '', fetchScriptContent } = rule || {};
  const insertStubKey = useSelector(state => selectors._editor(state, editorId).insertStubKey);

  const { errorLine, error } =
    useSelector(state => selectors._editorPreviewError(state, editorId), shallowEqual);
  const hasError = !!error;
  const data = useSelectorMemo(selectors.makeResourceDataSelector, 'scripts', scriptId);
  const scriptContent = data?.merged?.content;
  const allScripts = useSelectorMemo(selectors.makeResourceListSelector, scriptFilterConfig).resources;
  const patchRule = useCallback(
    val => {
      dispatch(actions._editor.patchRule(editorId, val));
    },
    [dispatch, editorId]
  );
  const requestScript = useCallback(() => {
    dispatch(actions.resource.request('scripts', scriptId));
  }, [dispatch, scriptId]);
  const handleCodeChange = useCallback(code => patchRule({ code }), [
    patchRule,
  ]);
  const handleScriptChange = useCallback(
    event => {
      if (!event.target.value) {
        return patchRule({
          scriptId: '',
          code: '',
          entryFunction: '',
        });
      }

      patchRule({ scriptId: event.target.value, fetchScriptContent: true });
    },
    [patchRule]
  );
  const handleInsertStubClick = useCallback(() => {
    const editor = aceEditor.current;
    const pos = editor?.getCursorPosition();

    // Fetches stub and insert it at the cursor position
    editor?.session?.insert(pos, getScriptHookStub(insertStubKey));
  }, [insertStubKey]);

  useEffect(() => {
    // fetchScriptContent ensures we are patching code only first time (when state is initialized) or
    // only when scriptId changes (and not on every remount)
    if (fetchScriptContent && scriptContent) {
      const patchObj = {
        code: scriptContent,
        fetchScriptContent: false,
      };

      // save a copy of _init_code for dirty checking
      patchObj._init_code = scriptContent;
      patchRule(patchObj);
    } else if (scriptContent === undefined && scriptId) {
      requestScript();
    }
  }, [scriptId, scriptContent, patchRule, requestScript, fetchScriptContent]);

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

  return (
    <LoadResources required resources={['scripts']}>
      <div className={classes.container}>
        <div data-public className={classes.formControls}>
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
            className={clsx(classes.textField, classes.entryFn)}
            value={entryFunction}
            onChange={event => patchRule({ entryFunction: event.target.value })}
            label="Function"
            margin="dense"
          />
          {scriptId && insertStubKey && (
          <Button
            variant="outlined"
            color="secondary"
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
