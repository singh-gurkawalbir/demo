import { useEffect, useState, useCallback, useRef } from 'react';
import AceEditor from 'react-ace';
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
import * as selectors from '../../reducers/user';
import handlebarCompleterSetup from '../AFE/editorSetup/editorCompleterSetup/index';

export default function CodeEditor(props) {
  const {
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
  } = props;
  const aceEditor = useRef(null);
  const [state, setState] = useState({
    inputVal: value,
    editorVal: value,
    typingTimeout: 0,
  });
  const theme = useSelector(state => selectors.editorTheme(state.user));
  const { inputVal, editorVal, typingTimeout } = state;
  const resize = useCallback(() => {
    if (aceEditor && aceEditor.resize) aceEditor.editor.resize();
  }, []);

  // this is equivalent to componentDidMount implementation done earlier. TODO
  useEffect(() => {
    resize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    // update the state value, only when user is not typing and new value is available from the selector.
    if (inputVal !== value && !typingTimeout) {
      setState({ ...state, inputVal: value, editorVal: value });
    }
  }, [inputVal, state, typingTimeout, value]);

  const handleLoad = editor => {
    if (enableAutocomplete) {
      handlebarCompleterSetup(editor);
    }
  };

  const handleChange = value => {
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    resize();
    setState({
      ...state,
      editorVal: value,
      typingTimeout: setTimeout(() => {
        onChange(value);
      }, 500),
    });
  };

  const valueAsString =
    typeof editorVal === 'string'
      ? editorVal
      : JSON.stringify(editorVal, null, 2);

  return (
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
  );
}
