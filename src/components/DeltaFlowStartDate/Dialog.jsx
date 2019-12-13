import { Dialog, Typography } from '@material-ui/core';
import DialogTitle from '@material-ui/core/DialogTitle';
import FlowStartDate from '.';

export default function FlowStartDateDialog({
  flowId,
  onClose,
  disabled,
  runDeltaFlow,
}) {
  const defaults = {
    width: '70vw',
    height: '50vh',
  };

  // todo: Azhar needs to ux changes here
  return (
    <Dialog open scroll="paper" maxWidth={false} {...defaults}>
      <DialogTitle disableTypography>
        <Typography variant="h6">Delta Flow</Typography>
      </DialogTitle>
      <FlowStartDate
        flowId={flowId}
        onClose={onClose}
        disabled={disabled}
        runDeltaFlow={runDeltaFlow}
      />
    </Dialog>
  );
}
