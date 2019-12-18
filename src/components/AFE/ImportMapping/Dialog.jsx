import MappingDialog from '../MappingDialog';
import StandaloneMapping from './StandaloneMapping';

export default function ImportMappingDialog(props) {
  const { id, flowId, resourceId, onSave, onClose, title, disabled } = props;

  return (
    <MappingDialog
      disabled={disabled}
      title={title}
      id={id}
      open
      onSave={onSave}
      onClose={onClose}>
      <StandaloneMapping
        id={id}
        flowId={flowId}
        resourceId={resourceId}
        disabled={disabled}
      />
    </MappingDialog>
  );
}
