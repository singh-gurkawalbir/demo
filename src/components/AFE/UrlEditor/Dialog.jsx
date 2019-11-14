import EditorDialog from '../EditorDialog';
import UrlEditor from './';

export default function UrlEditorDialog(props) {
  const { id, rule, data, disabled, ...rest } = props;
  const defaults = {
    layout: 'column',
    width: '70vw',
    height: '55vh',
    open: true,
  };

  return (
    <EditorDialog
      id={id}
      {...defaults}
      {...rest}
      disabled={disabled}
      showFullScreen>
      <UrlEditor disabled={disabled} editorId={id} rule={rule} data={data} />
    </EditorDialog>
  );
}
