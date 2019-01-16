import { Component } from 'react';
import CodeEditor from '../../../components/CodeEditor';

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
    showInvisibles: true,
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
      helperFunctions,
      jsonHints,
    } = this.props;
    const config = {
      ...defaults.global,
      ...defaults[mode],
      ...overrides,
    };
    let safeValue = '';

    if (value) {
      if (typeof value === 'string') {
        safeValue = value;
      } else if (typeof value === 'object') {
        safeValue = JSON.stringify(value, null, 2);
      } else {
        safeValue = `${value}`;
      }
    }

    return (
      <CodeEditor
        // ref={c => (this.editor = c)}
        helperFunctions={helperFunctions}
        jsonHints={jsonHints}
        name={name}
        value={safeValue}
        mode={mode}
        readOnly={readOnly}
        height={height}
        width={width}
        showGutter={config.showGutter}
        showInvisibles={config.showInvisibles}
        enableLiveAutocompletion={config.enableLiveAutocompletion}
        wrap={config.wrap}
        onChange={onChange}
      />
    );
  }
}
