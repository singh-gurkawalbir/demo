import React, { useEffect, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import makeStyles from '@mui/styles/makeStyles';
import {
  TextField,
  MenuItem,
  FormControl,
  FormLabel,
} from '@mui/material';
import shallowEqual from 'react-redux/lib/utils/shallowEqual';
import { Spinner } from '@celigo/fuse-ui';
import LoadResources from '../../../../LoadResources';
import CodePanel from '../Code';
import actions from '../../../../../actions';
import { selectors } from '../../../../../reducers';
import { hooksLabelMap, getScriptHookStub } from '../../../../../utils/hooks';
import useSelectorMemo from '../../../../../hooks/selectors/useSelectorMemo';
import CeligoSelect from '../../../../CeligoSelect';
import OutlinedButton from '../../../../Buttons/OutlinedButton';

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
  selectMenu: {
    wordBreak: 'break-word',
    maxWidth: '320px',
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
    minHeight: 38,
  },
}));
const scriptFilterConfig = { type: 'scripts' };

export default function JavaScriptPanel({ editorId }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const aceEditor = useRef(null);
  const rule = useSelector(state => selectors.editorRule(state, editorId));
  const disabled = useSelector(state => selectors.isEditorDisabled(state, editorId));
  const {code = '', entryFunction = '', scriptId = '', fetchScriptContent } = rule || {};
  const insertStubKey = useSelector(state => selectors.editor(state, editorId).insertStubKey);

  const { errorLine, error, errSourceProcessor } =
    useSelector(state => selectors.editorPreviewError(state, editorId), shallowEqual);

  let hasError = false;

  if (errSourceProcessor) {
    hasError = !!error && errSourceProcessor === 'javascript';
  } else {
    hasError = !!error;
  }
  const data = useSelectorMemo(selectors.makeResourceDataSelector, 'scripts', scriptId);
  const {flowId} = useSelector(state => selectors.editor(state, editorId));
  const isIntegrationApp = !!useSelector(state => selectors.resource(state, 'flows', flowId)?._connectorId);
  const scriptContent = data?.merged?.content;
  const allScripts = useSelectorMemo(selectors.makeResourceListSelector, scriptFilterConfig).resources;
  const fetchScript = scriptContent === undefined && !!scriptId && !isIntegrationApp;
  const patchRule = useCallback(
    val => {
      dispatch(actions.editor.patchRule(editorId, val));
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
    } else if (fetchScript) {
      requestScript();
    }
  }, [fetchScriptContent, patchRule, requestScript, scriptContent, fetchScript]);

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

  // This is temporary code to demo the panel in storybook.
  // We really need to refactor this code so these components can render even if
  // disconnected from thr API. In this case, if it is not possible to load
  // the user's scripts.
  const required = editorId !== 'storybook-router';

  return (
    <LoadResources required={required} resources={['scripts']}>
      <div className={classes.container}>
        <div className={classes.headerContainer}>
          <FormControl variant="standard" className={classes.jsPanelFormControl} error={!scriptId}>
            <FormLabel htmlFor="scriptId">
              Script
            </FormLabel>
            <CeligoSelect
              isLoggable
              id="scriptId"
              margin="dense"
              value={scriptId}
              className={classes.textField}
              MenuProps={{
                anchorOrigin: {
                  vertical: 'bottom',
                  horizontal: 'center',
                },
                transformOrigin: {
                  vertical: 'top',
                  horizontal: 'center',
                },
                getContentAnchorEl: null,
                classes: { paper: classes.selectMenu },

              }}
              displayEmpty
              disabled={disabled}
              onChange={handleScriptChange}>
              {[defaultItem, ...scriptOptions]}
            </CeligoSelect>
          </FormControl>
          <FormControl variant="standard" className={classes.jsPanelFormControl} error={!entryFunction}>
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
          <OutlinedButton
            color="secondary"
            onClick={handleInsertStubClick}
            disabled={disabled}
            className={classes.btnAction}
            data-test={insertStubKey}>
            {`Insert ${hooksLabelMap[insertStubKey].toLowerCase()} stub`}
          </OutlinedButton>
          )}
        </div>
        {/* hide the script content */}
        <div className={classes.scriptPanel}>
          {fetchScript ? (
            <Spinner center="screen" />
          ) : (
            <CodePanel
              name="code"
              id="code"
              readOnly={disabled || !scriptId}
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
