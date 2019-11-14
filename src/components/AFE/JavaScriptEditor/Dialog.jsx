import EditorDialog from '../EditorDialog';
import JavaScriptEditor from './';

export default function JavaScriptEditorDialog(props) {
  const { id, rule, data, scriptId, disabled, entryFunction, ...rest } = props;
  const defaults = {
    width: '80vw',
    height: '50vh',
    open: true,
  };

  return (
    <EditorDialog
      id={id}
      {...defaults}
      {...rest}
      showLayoutOptions={false}
      disabled={disabled}>
      <JavaScriptEditor
        editorId={id}
        scriptId={scriptId}
        entryFunction={entryFunction}
        data={data}
        disabled={disabled}
      />
    </EditorDialog>
  );
}
