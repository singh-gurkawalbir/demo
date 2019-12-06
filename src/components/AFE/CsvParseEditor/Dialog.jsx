import EditorDialog from '../EditorDialog';
import CsvParseEditor from './';

export default function CsvParseEditorDialog(props) {
  const { id, rule, data, disabled, resourceType, ...rest } = props;
  const defaults = {
    width: '80vw',
    height: '70vh',
    open: true,
  };

  return (
    <EditorDialog
      id={id}
      {...defaults}
      {...rest}
      showLayoutOptions={false}
      disabled={disabled}
      showFullScreen>
      <CsvParseEditor
        disabled={disabled}
        resourceType={resourceType}
        editorId={id}
        rule={rule}
        data={data}
      />
    </EditorDialog>
  );
}
