import React, { useEffect, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import {
  TextField,
  MenuItem,
  FormControl,
  FormLabel,
  Button } from '@material-ui/core';
import shallowEqual from 'react-redux/lib/utils/shallowEqual';
import LoadResources from '../../../../LoadResources';
import CodePanel from '../Code';
import actions from '../../../../../actions';
import { selectors } from '../../../../../reducers';
import { hooksLabelMap, getScriptHookStub } from '../../../../../utils/hooks';
import useSelectorMemo from '../../../../../hooks/selectors/useSelectorMemo';
import Spinner from '../../../../Spinner';
import CeligoSelect from '../../../../CeligoSelect';

const useStyles = makeStyles(theme => ({
  container: {
    backgroundColor: theme.palette.background.default,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  scriptPanel: {
    width: '100%',
    height: '100%',
  },
  textField: {
    marginTop: '0px !important',
  },
  headerContainer: {
    display: 'flex',
    alignItems: 'flex-start',
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
              onChange={event => patchRule({ entryFunction: event.target.value })}
          />
          </FormControl>
          {scriptId && insertStubKey && (
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleInsertStubClick}
            disabled={disabled}
            className={classes.btnAction}
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
