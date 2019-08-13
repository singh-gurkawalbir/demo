import EditorDialog from '../EditorDialog';
import HttpRequestBodyEditor from './';

export default function HttpRequestBodyDialog(props) {
  const {
    id,
    rule,
    data,
    onClose,
    open = true,
    layout = 'row',
    title,
    width = '85vw',
    height = '60vh',
  } = props;

  return (
    <EditorDialog
      id={id}
      open={open}
      title={title}
      layout={layout}
      width={width}
      height={height}
      onClose={onClose}>
      <HttpRequestBodyEditor
        layout={layout}
        editorId={id}
        rule={rule}
        data={data}
      />
    </EditorDialog>
  );
}
