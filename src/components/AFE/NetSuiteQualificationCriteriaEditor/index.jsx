import EditorDialog from '../EditorDialog';
import DynaNetSuiteQualificationCriteria from '../../DynaForm/fields/DynaNetSuiteQualificationCriteria';

export default function NetSuiteQualificationCriteriaEditor(props) {
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
      <DynaNetSuiteQualificationCriteria editorId={id} {...props} />
    </EditorDialog>
  );
}
