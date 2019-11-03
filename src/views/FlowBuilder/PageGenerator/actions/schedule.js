import { Dialog, Typography, DialogTitle } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Icon from '../../../../components/icons/CalendarIcon';
import helpTextMap from '../../../../components/Help/helpTextMap';

const useStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(3),
  },
}));

function ScheduleDialog({ flowId, resource, open, onClose }) {
  const classes = useStyles();
  const resourceId = resource._id;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{ className: classes.paper }}>
      <DialogTitle disableTypography>
        <Typography variant="h6">Export Schedule</Typography>
      </DialogTitle>
      <Typography>flowId: {flowId}</Typography>
      <Typography>exportId: {resourceId}</Typography>
    </Dialog>
  );
}

export default {
  // used to create data-test attribute and component key. Should be unique across FB actions.
  name: 'exportSchedule',
  position: 'middle',
  Icon,
  helpText: helpTextMap['fb.pg.exports.schedule'],
  Component: ScheduleDialog,
};
