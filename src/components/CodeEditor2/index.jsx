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

const mapStateToProps = state => ({
  theme: selectors.editorTheme(state.user),
});

@withStyles({
  // root: {
  //   fontSize: 16,
  //   width: '100%',
  //   height: '100%',
  //   position: 'relative',
  // },
})
class CodeEditor2 extends Component {
  handleChange = value => {
    // anytime the container DOM element changes size (both height and width)
    // the resize method of the editor needs to be fired so it can internally
    // adjust it's internal variables that control the controlled scrollbars
    // and basic functionality.
    // TODO:
    // We are cheating here and calling the resize on EVERY change... The better
    // approach would be to onyl call resize whenever the parent component
    // changed its size...
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
      readOnly,
      width,
      height,
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
        readOnly={readOnly}
        width={width || '100%'}
        height={height || '100%'}
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
