import EditorDialog from '../EditorDialog';
import MergeEditor from './';

export default function MergeEditorDialog(props) {
  const { id, rule, data, disabled, ...rest } = props;
  const defaults = {
    layout: 'column',
    width: '80vw',
    height: '50vh',
    open: true,
  };

  return (
    <EditorDialog
      id={id}
      {...defaults}
      {...rest}
      disabled={disabled}
      showFullScreen>
      <MergeEditor editorId={id} rule={rule} data={data} disabled={disabled} />
    </EditorDialog>
  );
}
