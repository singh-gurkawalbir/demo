import EditorDialog from '../EditorDialog';
import DynaSalesforceLookupFilters from '../../DynaForm/fields/DynaSalesforceLookupFilters';

export default function SalesforceLookupFilterEditorDialog(props) {
  const { id } = props;
  const defaults = {
    layout: 'column',
    width: '70vw',
    height: '55vh',
    open: true,
  };

  return (
    <EditorDialog
      {...defaults}
      {...props}
      showFullScreen
      showLayoutOptions={false}
      hidePreviewAction>
      <DynaSalesforceLookupFilters editorId={id} {...props} />
    </EditorDialog>
  );
}
