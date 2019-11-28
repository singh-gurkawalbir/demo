import EditorDialog from '../EditorDialog';
import DynaSalesforceQualificationCriteria from '../../DynaForm/fields/DynaSalesforceRealtimeQualifier';

export default function SalesforceQualificationCriteriaEditor(props) {
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
      <DynaSalesforceQualificationCriteria editorId={id} {...props} />
    </EditorDialog>
  );
}
