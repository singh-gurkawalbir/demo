import EditorDialog from '../EditorDialog';
import UrlEditor from './';

export default function UrlEditorDialog(props) {
  const {
    id,
    rule,
    data,
    title,
    onClose,
    layout = 'column',
    open = true,
    width = '70vw',
    height = '55vh',
  } = props;

  return (
    <EditorDialog
      id={id}
      open={open}
      layout={layout}
      title={title}
      width={width}
      height={height}
      onClose={onClose}
      showFullScreen>
      <UrlEditor layout={layout} editorId={id} rule={rule} data={data} />
    </EditorDialog>
  );
}
