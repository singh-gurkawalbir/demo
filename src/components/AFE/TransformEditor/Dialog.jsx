import EditorDialog from '../EditorDialog';
import TransformEditor from './';

export default function TransformEditorDialog(props) {
  const { id, rule, data, ...rest } = props;
  const defaults = {
    width: '85vw',
    height: '60vh',
    layout: 'column',
    open: true,
  };

  return (
    <EditorDialog id={id} {...defaults} {...rest} showLayoutOptions={false}>
      <TransformEditor editorId={id} rule={rule} data={data} />
    </EditorDialog>
  );
}
