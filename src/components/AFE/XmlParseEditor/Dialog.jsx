import EditorDialog from '../EditorDialog';
import XmlParseEditor from './';

export default function XmlParseEditorDialog(props) {
  const { id, rule, data, disabled, ...rest } = props;
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
      <XmlParseEditor
        disabled={disabled}
        editorId={id}
        rule={rule}
        data={data}
      />
    </EditorDialog>
  );
}
