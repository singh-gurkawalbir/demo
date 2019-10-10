import RightDrawer from '../RightDrawer';

export default function ScheduleDrawer({ flowId, ...props }) {
  return (
    <RightDrawer {...props} path="schedule">
      This is the new SCHEDULE drawer for flow: {flowId}
    </RightDrawer>
  );
}
