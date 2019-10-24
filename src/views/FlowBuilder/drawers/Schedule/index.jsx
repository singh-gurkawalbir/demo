import RightDrawerRouter from '../RightDrawer';
import FlowSchedule from '../../../../components/FlowSchedule';

export default function ScheduleDrawer({ flow, history, ...props }) {
  const onClose = () => history.goBack();

  return (
    <RightDrawerRouter {...props} path="schedule">
      <FlowSchedule flow={flow} title="Flow Schedule" onClose={onClose} />
    </RightDrawerRouter>
  );
}
