import EditorDialog from '../EditorDialog';
import TransformEditor from './';

export default function TransformEditorDialog(props) {
  const { id, rule, data, disabled, ...rest } = props;
  const defaults = {
    width: '85vw',
    height: '60vh',
    layout: 'column',
    open: true,
  };

  return (
    <EditorDialog
      id={id}
      {...defaults}
      {...rest}
      disabled={disabled}
      showLayoutOptions={false}>
      <TransformEditor
        editorId={id}
        rule={rule}
        data={data}
        disabled={disabled}
      />
    </EditorDialog>
  );
}
