import { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import AceEditor from 'react-ace';
import 'brace/mode/javascript';
import 'brace/mode/handlebars';
import 'brace/mode/json';
import 'brace/mode/xml';
import 'brace/theme/monokai';
import 'brace/theme/github';
import 'brace/ext/language_tools';
import * as selectors from '../../reducers/session';

const mapStateToProps = state => ({
  theme: selectors.editorTheme(state.session),
});

@withStyles({
  root: {
    fontSize: 16,
    width: '100%',
    height: '100%',
    position: 'relative',
  },
})
class CodeEditor2 extends Component {
  handleChange = value => {
    this.resize();

    if (this.props.onChange) {
      this.props.onChange(value);
    }
  };

  resize() {
    // console.log('resizing to fit...');
    this.aceEditor.editor.resize();
  }

  componentDidMount() {
    this.resize();
  }

  render() {
    const {
      name,
      theme,
      value,
      mode,
      showGutter,
      enableLiveAutocompletion,
      classes,
    } = this.props;

    // console.log('rendering ace editor...');

    return (
      <AceEditor
        name={name}
        className={classes.root}
        value={value}
        mode={mode}
        width="100%"
        height="100%"
        showPrintMargin={false}
        showGutter={showGutter}
        // enableLiveAutocompletion={enableLiveAutocompletion}
        theme={theme}
        onChange={this.handleChange}
        ref={c => {
          this.aceEditor = c;
        }}
        setOptions={{
          // enableBasicAutocompletion: false,
          enableLiveAutocompletion,
          // showLineNumbers: true,
          tabSize: 2,
        }}
        editorProps={{ $blockScrolling: true }}
      />
    );
  }
}

export default connect(mapStateToProps)(CodeEditor2);
