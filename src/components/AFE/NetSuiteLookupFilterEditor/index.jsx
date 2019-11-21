import EditorDialog from '../EditorDialog';
import DynaNetSuiteLookupFilters from '../../DynaForm/fields/DynaNetSuiteLookupFilters';

export default function NetSuiteLookupFilterEditorDialog(props) {
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
      showFullScreen
      showLayoutOptions={false}
      hidePreviewAction>
      <DynaNetSuiteLookupFilters editorId={id} {...props} />
    </EditorDialog>
  );
}
