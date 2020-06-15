/* eslint-disable import/no-extraneous-dependencies */
import React, { useEffect, useState, useRef, useCallback } from 'react';
import AceEditor from 'react-ace';
import ReactResizeDetector from 'react-resize-detector';
import 'brace/mode/javascript';
import 'brace/mode/handlebars';
import 'brace/mode/json';
import 'brace/mode/xml';
import 'brace/mode/html';
import 'brace/theme/monokai';
import 'brace/theme/tomorrow';
import 'brace/mode/sql';
import 'brace/ext/language_tools';
import 'brace/ext/searchbox';
import 'brace/ext/beautify';
import { useSelector } from 'react-redux';
import * as selectors from '../../reducers';
import handlebarCompleterSetup from '../AFE/editorSetup/editorCompleterSetup/index';

export default function CodeEditor({
  name,
  value = '',
  mode,
  readOnly,
  width,
  height,
  wrap,
  showGutter,
  showInvisibles,
  useWorker,
  enableAutocomplete,
  onChange,
  skipDelay = false,
}) {
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
    if (aceEditor && aceEditor.current && aceEditor.current.editor) aceEditor.current.editor.resize();
  }, []);

  useEffect(() => {
    if (!skipDelay) {
      // update the state value, only when user is not typing and new value is available from the selector.
      if (inputVal !== value && !typingTimeout) {
        setState({ ...state, inputVal: value, editorVal: value });
      }
    }
  }, [inputVal, skipDelay, state, typingTimeout, value]);

  const handleLoad = useCallback((
    editor => {
      if (enableAutocomplete) {
        handlebarCompleterSetup(editor);
      }
      if (mode === 'javascript') {
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
        }])
      }
    }),
  [enableAutocomplete, mode]
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
  return (
    <>
      <AceEditor
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
          showInvisibles,
          wrap,
          // showLineNumbers: true,
          tabSize: 2,
        }}
        editorProps={{ $blockScrolling: true }}
      />

      <ReactResizeDetector handleWidth handleHeight onResize={resize} />
    </>
  );
}
