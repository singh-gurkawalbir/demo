import { Typography, DialogTitle } from '@material-ui/core';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Icon from '../../../../components/icons/CalendarIcon';
import helpTextMap from '../../../../components/Help/helpTextMap';
import ModalDialog from '../../../../components/ModalDialog';
import * as selectors from '../../../../reducers';
import FlowSchedule from '../../../../components/FlowSchedule';

const useStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(3),
  },
}));

function ScheduleDialog({
  flowId,
  isViewMode,
  resource,
  open,
  onClose,
  pg,
  index,
}) {
  const classes = useStyles();
  const resourceId = resource._id;
  const flow = useSelector(state => selectors.resource(state, 'flows', flowId));

  return (
    <ModalDialog
      show={open}
      handleClose={onClose}
      maxWidth={false}
      disabled={isViewMode}
      PaperProps={{ className: classes.paper }}>
      <DialogTitle disableTypography>
        <Typography variant="h6">Export Schedule</Typography>
      </DialogTitle>
      <FlowSchedule
        flow={flow}
        pageGeneratorId={resourceId}
        onClose={onClose}
        pg={pg}
        index={index}
      />
    </ModalDialog>
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
