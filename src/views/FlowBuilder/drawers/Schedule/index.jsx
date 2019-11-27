import { useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import RightDrawerRouter from '../RightDrawer';
import FlowSchedule from '../../../../components/FlowSchedule';
import TitleBar from '../TitleBar';

const useStyle = makeStyles(theme => ({
  fbContDrawer: {
    width: '100%',
    overflowX: 'hidden',
    marginTop: -1,
    padding: theme.spacing(2),
  },
}));

export default function ScheduleDrawer({
  flow,
  history,
  isViewMode,
  ...props
}) {
  const handleClose = useCallback(() => history.goBack(), [history]);
  const classes = useStyle();

  return (
    <RightDrawerRouter {...props} path="schedule">
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
