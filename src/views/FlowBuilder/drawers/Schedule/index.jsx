import { makeStyles } from '@material-ui/core/styles';
import RightDrawerRouter from '../RightDrawer';
import FlowSchedule from '../../../../components/FlowSchedule';
import TitleBar from '../TitleBar';

const useStyle = makeStyles(theme => ({
  fbContDrawer: {
    width: '100%',
    overflowX: 'hidden',
    marginTop: -1,
    padding: theme.spacing(3),
  },
}));

export default function ScheduleDrawer({
  flow,
  history,
  isViewMode,
  ...props
}) {
  const onClose = () => history.goBack();
  const classes = useStyle();

  return (
    <RightDrawerRouter {...props} path="schedule">
      <TitleBar title="Flow Schedule" />
      <FlowSchedule
        disabled={isViewMode}
        flow={flow}
        onClose={onClose}
        className={classes.fbContDrawer}
      />
    </RightDrawerRouter>
  );
}
