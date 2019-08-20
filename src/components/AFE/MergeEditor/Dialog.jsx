import EditorDialog from '../EditorDialog';
import MergeEditor from './';

export default function MergeEditorDialog(props) {
  const { id, rule, data, ...rest } = props;
  const defaults = {
    layout: 'column',
    width: '80vw',
    height: '50vh',
    open: true,
  };

  return (
    <EditorDialog id={id} {...defaults} {...rest} showFullScreen>
      <MergeEditor editorId={id} rule={rule} data={data} />
    </EditorDialog>
  );
}
