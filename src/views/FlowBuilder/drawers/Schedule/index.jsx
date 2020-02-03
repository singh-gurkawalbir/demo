import { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { IconButton } from '@material-ui/core';
import RightDrawerRouter from '../RightDrawer';
import FlowSchedule from '../../../../components/FlowSchedule';
import TitleBar from '../TitleBar';
import Close from '../../../../components/icons/CloseIcon';

const useStyle = makeStyles(theme => ({
  fbContDrawer: {
    width: '100%',
    overflowX: 'hidden',
    marginTop: -1,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: 2,
  },
}));

export default function ScheduleDrawer({
  flow,
  isViewMode,
  isConnector,
  ...props
}) {
  const history = useHistory();
  const handleClose = useCallback(() => history.goBack(), [history]);
  const classes = useStyle();

  // TODO: Connector specific things to be added for schedule drawer incase of !isViewMode && isConnector
  return (
    <RightDrawerRouter {...props} path="schedule">
      <IconButton
        data-test="closeFlowSchedule"
        aria-label="Close"
        className={classes.closeButton}
        onClick={handleClose}>
        <Close />
      </IconButton>
      <TitleBar title="Flow Schedule" />
      <FlowSchedule
        disabled={isViewMode}
        flow={flow}
        onClose={handleClose}
        className={classes.fbContDrawer}
      />
    </RightDrawerRouter>
  );
}
