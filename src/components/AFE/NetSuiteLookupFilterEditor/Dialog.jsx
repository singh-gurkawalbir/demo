import EditorDialog from '../EditorDialog';
import DynaNSFilters from '../../DynaForm/fields/DynaNSFilters';

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
      <DynaNSFilters editorId={id} {...props} />
    </EditorDialog>
  );
}
