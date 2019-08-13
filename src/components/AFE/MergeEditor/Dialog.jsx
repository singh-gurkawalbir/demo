import EditorDialog from '../EditorDialog';
import MergeEditor from './';

export default function MergeEditorDialog(props) {
  const {
    id,
    rule,
    data,
    layout = 'column',
    title,
    onClose,
    width = '80vw',
    height = '50vh',
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
      showFullScreen>
      <MergeEditor layout={layout} editorId={id} rule={rule} data={data} />
    </EditorDialog>
  );
}
