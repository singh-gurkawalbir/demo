import EditorDialog from '../EditorDialog';
import TransformEditor from './';

const defaults = {
  width: '85vw',
  height: '60vh',
  layout: 'column',
  open: true,
};

export default function TransformEditorDialog({
  id,
  rule,
  data,
  disabled,
  ...rest
}) {
  // console.log('render <TransformEditorDialog>');

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
