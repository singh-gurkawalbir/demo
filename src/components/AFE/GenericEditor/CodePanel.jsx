import CodeEditor from '../../../components/CodeEditor';

const defaults = {
  global: {
    showGutter: true,
    enableLiveAutocompletion: true,
    useWorker: true,
  },
  handlebars: {
    showGutter: false,
  },
  text: {
    showGutter: false,
    showInvisibles: true,
  },
};

export default function CodePanel(props) {
  const {
    name,
    value,
    mode,
    readOnly = false,
    height,
    width,
    onChange,
    enableAutocomplete,
    overrides,
  } = props;
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
      name={name}
      value={safeValue}
      mode={mode}
      readOnly={readOnly}
      height={height}
      width={width}
      showGutter={config.showGutter}
      showInvisibles={config.showInvisibles}
      useWorker={config.useWorker}
      enableAutocomplete={enableAutocomplete}
      wrap={config.wrap}
      onChange={onChange}
    />
  );
}
