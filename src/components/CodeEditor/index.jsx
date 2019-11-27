import { Component } from 'react';
import { connect } from 'react-redux';
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
import * as selectors from '../../reducers/user';
import handlebarCompleterSetup from '../AFE/editorSetup/editorCompleterSetup/index';

const mapStateToProps = state => ({
  theme: selectors.editorTheme(state.user),
});

class CodeEditor extends Component {
  componentDidMount() {
    // TODO: anytime the container DOM element changes size (both height and width)
    // the resize method of the editor needs to be fired so it can internally
    // adjust it's internal variables that control the controlled scrollbars
    // and basic functionality.
    // TODO: We are cheating here and calling the resize on EVERY change...
    // The better approach would be to only call resize whenever the parent
    // component changed its size...
    this.resize();
  }
  handleLoad = enableAutocomplete => editor => {
    if (enableAutocomplete) {
      handlebarCompleterSetup(editor);
    }
  };

  handleChange = value => {
    if (this.props.onChange) {
      this.props.onChange(value);
    }

    this.resize();
  };

  resize() {
    this.aceEditor.editor.resize();
  }

  render() {
    const {
      name,
      theme,
      value = '',
      mode,
      readOnly,
      width,
      height,
      wrap,
      showGutter,
      showInvisibles,
      enableAutocomplete,
    } = this.props;
    const valueAsString =
      typeof value === 'string' ? value : JSON.stringify(value, null, 2);

    return (
      <AceEditor
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
        onLoad={this.handleLoad(enableAutocomplete)}
        onChange={this.handleChange}
        ref={c => {
          this.aceEditor = c;
        }}
        setOptions={{
          showInvisibles,
          wrap,
          // showLineNumbers: true,
          tabSize: 2,
        }}
        editorProps={{ $blockScrolling: true }}
      />
    );
  }
}

// prettier-ignore
export default connect(mapStateToProps)(CodeEditor);
