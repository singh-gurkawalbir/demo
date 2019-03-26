import { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import AceEditor from 'react-ace';
import 'brace/mode/javascript';
import 'brace/mode/handlebars';
import 'brace/mode/json';
import 'brace/mode/xml';
import 'brace/theme/monokai';
import 'brace/theme/tomorrow';
import 'brace/ext/language_tools';
import * as selectors from '../../reducers/user';
import handlebarCompleterSetup from '../AFE/editorSetup/editorCompleterSetup/index';

const mapStateToProps = state => ({
  theme: selectors.editorTheme(state.user),
  editors: state && state.session && state.session.editors,
});

@withStyles({
  // root: {
  //   fontSize: 16,
  //   width: '100%',
  //   height: '100%',
  //   position: 'relative',
  // },
})
class CodeEditor extends Component {
  componentDidMount() {
    // anytime the container DOM element changes size (both height and width)
    // the resize method of the editor needs to be fired so it can internally
    // adjust it's internal variables that control the controlled scrollbars
    // and basic functionality.
    // TODO: We are cheating here and calling the resize on EVERY change...
    // The better approach would be to onyl call resize whenever the parent
    // component changed its size...
    this.resize();
  }

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
      classes,
    } = this.props;
    const valueAsString =
      typeof value === 'string' ? value : JSON.stringify(value);

    return (
      <AceEditor
        name={name}
        className={classes.root}
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
        onLoad={editor => {
          if (enableAutocomplete) {
            handlebarCompleterSetup(editor);
          }
        }}
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
