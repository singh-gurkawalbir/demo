/* eslint-disable import/no-extraneous-dependencies */
import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import ace from 'ace-builds/src-noconflict/ace';
import AceEditor from 'react-ace';
import { alpha } from '@mui/material/styles';
import makeStyles from '@mui/styles/makeStyles';
import ReactResizeDetector from 'react-resize-detector';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/mode-handlebars';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/mode-xml';
import 'ace-builds/src-noconflict/mode-html';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/theme-tomorrow';
import 'ace-builds/src-noconflict/mode-sql';
import 'ace-builds/src-noconflict/ext-language_tools';
import 'ace-builds/src-noconflict/ext-searchbox';
import 'ace-builds/src-noconflict/ext-beautify';
import { useSelector } from 'react-redux';
import jsonWorkerUrl from 'ace-builds/src-noconflict/worker-json';
import javascriptWorkerUrl from 'ace-builds/src-noconflict/worker-javascript';
import cssWorkerUrl from 'ace-builds/src-noconflict/worker-css';
import xmlWorkerUrl from 'ace-builds/src-noconflict/worker-xml';
import { selectors } from '../../reducers';
import handlebarCompleterSetup from '../AFE/Editor/panels/Handlebars/autocompleteSetup/editorCompleterSetup';

ace.config.setModuleUrl('ace/mode/css_worker', cssWorkerUrl);
ace.config.setModuleUrl('ace/mode/json_worker', jsonWorkerUrl);
ace.config.setModuleUrl('ace/mode/javascript_worker', javascriptWorkerUrl);
ace.config.setModuleUrl('ace/mode/xml_worker', xmlWorkerUrl);

const useStyles = makeStyles(theme => ({
  editorErrorWrapper: {
    background: `${alpha(theme.palette.error.light, 0.06)} !important`,
    border: '1px solid',
    borderColor: theme.palette.error.dark,
    '& > .ace_gutter': {
      color: `${theme.palette.error.dark} !important`,
    },
  },
  editorWarningWrapper: {
    background: `${alpha(theme.palette.warning.main, 0.06)} !important`,
    border: '1px solid',
    borderColor: theme.palette.warning.main,
    '& > .ace_gutter': {
      color: `${theme.palette.warning.main} !important`,
    },
  },
  errorMarker: {
    background: alpha(theme.palette.error.dark, 0.3),
    color: theme.palette.background.paper,
    position: 'relative',
  },
}));

const editorProp = { $blockScrolling: true };
export default function CodeEditor({
  name,
  value = '',
  mode = 'text',
  readOnly,
  width,
  height,
  wrap,
  showGutter,
  showInvisibles,
  showLineNumbers = true,
  displayIndentGuides = true,
  useWorker,
  enableAutocomplete,
  onChange,
  skipDelay = false,
  hasError,
  hasWarning,
  errorLine,
  onLoad,
}) {
  const classes = useStyles();
  const aceEditor = useRef(null);
  // inputVal holds value being passed from the prop. editorVal holds current value of the editor
  const [state, setState] = useState({
    inputVal: value,
    editorVal: value,
    typingTimeout: 0,
  });
  const theme = useSelector(state => selectors.editorTheme(state));
  const { inputVal, editorVal, typingTimeout } = state;
  const resize = useCallback(() => {
    if (aceEditor?.current?.editor) aceEditor.current.editor.resize();
  }, []);

  useEffect(() => {
    if (!skipDelay) {
      // update the state value, only when the new value is available from the props.
      if (inputVal !== value) {
        setState({ ...state, inputVal: value, editorVal: value });
      }
    }
  }, [inputVal, skipDelay, state, value]);

  const handleLoad = useCallback((
    editor => {
      if (enableAutocomplete) {
        handlebarCompleterSetup(editor);
      }
      if (mode === 'javascript' && editor && editor.session && editor.session.$worker) {
        // the options available are referenced here: https://jshint.com/docs/options/
        editor.session.$worker.send('changeOptions', [{
          asi: true,
          debug: true,
          eqnull: true,
          expr: true,
          funcscope: true,
          lastsemic: true,
          loopfunc: true,
          notypeof: true,
          noyield: true,
          proto: true,
          supernew: true,
          validthis: true,
          withstmt: true,
        }]);
      }

      onLoad?.(editor);
    }),
  [enableAutocomplete, mode, onLoad]
  );
  const handleChange = useCallback(
    value => {
      if (skipDelay) {
        return onChange(value);
      }

      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }

      setState({
        ...state,
        editorVal: value,
        typingTimeout: setTimeout(() => {
          onChange(value);
        }, 500),
      });
    },
    [onChange, skipDelay, state, typingTimeout]
  );
  let v = editorVal;

  if (skipDelay) v = value;
  const valueAsString = typeof v === 'string' ? v : JSON.stringify(v, null, 2);

  const markers = useMemo(() => errorLine ? [
    {
      startRow: errorLine - 1,
      endRow: errorLine,
      className: classes.errorMarker,
      type: 'line',
      inFront: true,
    }] : [], [classes.errorMarker, errorLine]);

  useEffect(() => {
    if (aceEditor?.current) {
      if (hasError) {
        aceEditor.current.editor.setStyle(classes.editorErrorWrapper);
      } else if (hasWarning) {
        aceEditor.current.editor.setStyle(classes.editorWarningWrapper);
      } else {
        aceEditor.current.editor.unsetStyle(classes.editorErrorWrapper);
        aceEditor.current.editor.unsetStyle(classes.editorWarningWrapper);
      }
    }
  }, [classes.editorErrorWrapper, classes.editorWarningWrapper, hasError, hasWarning]);

  return (
    <>
      <AceEditor
        wrapEnabled
        markers={markers}
        ref={aceEditor}
        name={name}
        value={valueAsString}
        mode={mode}
        readOnly={readOnly}
        width={width || '100%'}
        height={height || '100%'}
        showPrintMargin={false}
        showGutter={showGutter}
        enableLiveAutocompletion={enableAutocomplete}
        enableBasicAutocompletion={enableAutocomplete}
        theme={theme}
        onLoad={handleLoad}
        onChange={handleChange}
        setOptions={{
          useWorker,
          wrap,
          showInvisibles,
          showLineNumbers,
          displayIndentGuides,
          tabSize: 2,
        }}
        editorProps={editorProp}
      />

      <ReactResizeDetector handleWidth handleHeight onResize={resize} />
    </>
  );
}
