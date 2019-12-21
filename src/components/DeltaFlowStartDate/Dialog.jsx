import FlowStartDate from '.';
import ModalDialog from '../ModalDialog';

export default function FlowStartDateDialog({
  flowId,
  onClose,
  disabled,
  runDeltaFlow,
}) {
  return (
    <ModalDialog show minWidth="sm" onClose={onClose}>
      <div>Delta Flow</div>
      <div>
        <FlowStartDate
          flowId={flowId}
          onClose={onClose}
          disabled={disabled}
          runDeltaFlow={runDeltaFlow}
        />
      </div>
    </ModalDialog>
  );
}
