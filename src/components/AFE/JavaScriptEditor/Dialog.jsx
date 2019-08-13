import EditorDialog from '../EditorDialog';
import JavaScriptEditor from './';

export default function JavaScriptEditorDialog(props) {
  const {
    id,
    scriptId,
    entryFunction,
    title,
    data,
    width = '80vw',
    onClose,
    height = '60vh',
    open = true,
  } = props;

  return (
    <EditorDialog
      id={id}
      open={open}
      title={title}
      width={width}
      height={height}
      onClose={onClose}
      showLayoutOptions={false}>
      <JavaScriptEditor
        editorId={id}
        scriptId={scriptId}
        entryFunction={entryFunction}
        data={data}
      />
    </EditorDialog>
  );
}
