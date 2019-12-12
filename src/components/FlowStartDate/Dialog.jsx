import { Dialog, Typography } from '@material-ui/core';
import DialogTitle from '@material-ui/core/DialogTitle';
import FlowStartDate from '.';

export default function FlowStartDateDialog({
  flowId,
  onClose,
  disabled,
  isJobDashBoard,
}) {
  const defaults = {
    width: '70vw',
    height: '50vh',
  };

  return (
    <Dialog open scroll="paper" maxWidth={false} {...defaults}>
      <DialogTitle disableTypography>
        <Typography variant="h6">Delta Flow</Typography>
      </DialogTitle>
      <FlowStartDate
        isJobDashBoard={isJobDashBoard}
        flowId={flowId}
        onClose={onClose}
        disabled={disabled}
      />
    </Dialog>
  );
}
