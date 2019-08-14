import EditorDialog from '../EditorDialog';
import TransformEditor from './';

export default function TransformEditorDialog(props) {
  const {
    id,
    rule,
    data,
    title,
    onClose,
    layout = 'column',
    width = '85vw',
    height = '60vh',
    open = true,
  } = props;

  return (
    <EditorDialog
      id={id}
      open={open}
      title={title}
      layout={layout}
      width={width}
      height={height}
      onClose={onClose}
      showLayoutOptions={false}>
      <TransformEditor editorId={id} rule={rule} data={data} />
    </EditorDialog>
  );
}
