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
import jsonComputePaths from '../../utils/jsonPaths';
import * as selectors from '../../reducers/user';
import * as helpers from '../../editorSetup/completers';
import handlebarCompleterSetup from '../../editorSetup/editorCompleterSetup/index';

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
  loadJSONHints = () => {
    // When loading the code pannel expect the data code editor to load
    // When the data code editor loads then compute the JSON hints for the
    // editor
    const { name, mode, value, suggestions } = this.props;

    if (name === 'rule') {
      helpers.FunctionCompleters.functionsHints = suggestions;
    } else if (name === 'data') {
      let jsonHints = [];

      if (mode === 'json') {
        try {
          jsonHints = jsonComputePaths(JSON.parse(value));
          helpers.JsonCompleters.jsonHints = jsonHints;
        } catch (e) {
          jsonHints = [];
        }
      }
    }
  };

  render() {
    const {
      name,
      theme,
      value,
      mode,
      readOnly,
      width,
      height,
      wrap,
      showGutter,
      showInvisibles,
      classes,
    } = this.props;

    this.loadJSONHints();

    return (
      <AceEditor
        name={name}
        className={classes.root}
        value={value}
        mode={mode}
        readOnly={readOnly}
        width={width || '100%'}
        height={height || '100%'}
        showPrintMargin={false}
        showGutter={showGutter}
        enableLiveAutocompletion={name === 'rule' && mode === 'handlebars'}
        enableBasicAutocompletion={name === 'rule' && mode === 'handlebars'}
        theme={theme}
        onLoad={editor => {
          if (name === 'rule' && mode === 'handlebars') {
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
