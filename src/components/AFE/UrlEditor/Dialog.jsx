import EditorDialog from '../EditorDialog';
import UrlEditor from './';

export default function UrlEditorDialog(props) {
  const { id, rule, data, ...rest } = props;
  const defaults = {
    layout: 'column',
    width: '70vw',
    height: '55vh',
    open: true,
  };

  return (
    <EditorDialog id={id} {...defaults} {...rest} showFullScreen>
      <UrlEditor editorId={id} rule={rule} data={data} />
    </EditorDialog>
  );
}
