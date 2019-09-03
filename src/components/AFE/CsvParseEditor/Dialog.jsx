import EditorDialog from '../EditorDialog';
import CsvParseEditor from './';

export default function CsvParseEditorDialog(props) {
  const { id, rule, data, ...rest } = props;
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
      showFullScreen>
      <CsvParseEditor editorId={id} rule={rule} data={data} />
    </EditorDialog>
  );
}
