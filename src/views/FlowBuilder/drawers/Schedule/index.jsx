import { makeStyles } from '@material-ui/core/styles';
import RightDrawerRouter from '../RightDrawer';
import FlowSchedule from '../../../../components/FlowSchedule';
import TitleBar from '../TitleBar';

const useStyle = makeStyles({
  fbContDrawer: {
    width: '100%',
    overflowX: 'hidden',
    marginTop: -1,
    padding: 0,
  },
});

export default function ScheduleDrawer({ flow, history, ...props }) {
  const onClose = () => history.goBack();
  const classes = useStyle();

  return (
    <RightDrawerRouter {...props} path="schedule">
      <TitleBar title="Flow Schedule" />
      <FlowSchedule
        flow={flow}
        onClose={onClose}
        className={classes.fbContDrawer}
      />
    </RightDrawerRouter>
  );
}
