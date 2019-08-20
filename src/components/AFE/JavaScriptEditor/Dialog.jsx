import EditorDialog from '../EditorDialog';
import JavaScriptEditor from './';

export default function JavaScriptEditorDialog(props) {
  const { id, rule, data, scriptId, entryFunction, ...rest } = props;
  const defaults = {
    width: '80vw',
    height: '50vh',
    open: true,
  };

  return (
    <EditorDialog id={id} {...defaults} {...rest} showLayoutOptions={false}>
      <JavaScriptEditor
        editorId={id}
        scriptId={scriptId}
        entryFunction={entryFunction}
        data={data}
      />
    </EditorDialog>
  );
}
