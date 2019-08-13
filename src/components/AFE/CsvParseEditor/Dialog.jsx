import EditorDialog from '../EditorDialog';
import CsvParseEditor from './';

export default function CsvParseEditorDialog(props) {
  const {
    id,
    rule,
    data,
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
      width={width}
      height={height}
      onClose={onClose}
      showLayoutOptions={false}
      showFullScreen>
      <CsvParseEditor editorId={id} rule={rule} data={data} />
    </EditorDialog>
  );
}
