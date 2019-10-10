// import { makeStyles } from '@material-ui/core/styles';
import RightDrawer from '../RightDrawer';
import TitleBar from '../TitleBar';

// const useStyles = makeStyles(() => ({}));

export default function ScheduleDrawer({ flowId, history, ...props }) {
  const handleSubmit = () => history.goBack();
  // const classes = useStyles();

  return (
    <RightDrawer {...props} path="schedule">
      <TitleBar history={history} title="Schedule" onSubmit={handleSubmit} />
      For flow: {flowId}
    </RightDrawer>
  );
}
