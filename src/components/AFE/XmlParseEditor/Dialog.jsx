import EditorDialog from '../EditorDialog';
import XmlParseEditor from './';

export default function XmlParseEditorDialog(props) {
  const {
    id,
    rule,
    data,
    title,
    onClose,
    width = '80vw',
    height = '70vh',
    open = true,
  } = props;

  return (
    <EditorDialog
      id={id}
      open={open}
      title={title}
      onClose={onClose}
      width={width}
      height={height}
      showLayoutOptions={false}
      showFullScreen>
      <XmlParseEditor editorId={id} rule={rule} data={data} />
    </EditorDialog>
  );
}
