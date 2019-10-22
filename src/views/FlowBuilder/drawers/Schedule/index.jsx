import { makeStyles } from '@material-ui/core/styles';
import RightDrawerRouter from '../RightDrawer';
import FlowSchedule from '../../../../components/FlowSchedule';

const useStyle = makeStyles({
  fbContentDrawer: {
    width: '80vw',
  },
});

export default function ScheduleDrawer({ flow, history, ...props }) {
  const handleSubmit = () => history.goBack();
  const classes = useStyle();

  return (
    <RightDrawerRouter
      {...props}
      path="schedule"
      width="80vw"
      className={classes.fbContentDrawer}>
      <FlowSchedule
        onClose={handleSubmit}
        flow={flow}
        title="Flow Schedule"
        isFlowBuilder
      />
    </RightDrawerRouter>
  );
}
