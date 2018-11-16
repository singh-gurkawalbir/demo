import { Component } from 'react';
import CodeEditor from '../../../components/CodeEditor2';

const defaults = {
  global: {
    showGutter: true,
    enableLiveAutocompletion: true,
  },
  handlebars: {
    showGutter: false,
  },
  text: {
    showGutter: false,
  },
};

export default class CodePanel extends Component {
  render() {
    const {
      name,
      value,
      mode,
      readOnly,
      height,
      width,
      onChange,
      overrides,
    } = this.props;
    const config = {
      ...defaults.global,
      ...defaults[mode],
      ...overrides,
    };

    return (
      <CodeEditor
        // ref={c => (this.editor = c)}
        name={name}
        value={value}
        mode={mode}
        readOnly={readOnly}
        height={height}
        width={width}
        showGutter={config.showGutter}
        enableLiveAutocompletion={config.enableLiveAutocompletion}
        onChange={onChange}
      />
    );
  }
}
