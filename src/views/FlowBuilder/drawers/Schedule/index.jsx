// import { makeStyles } from '@material-ui/core/styles';
import RightDrawerRouter from '../RightDrawer';
import TitleBar from '../TitleBar';

// const useStyles = makeStyles(() => ({}));

export default function ScheduleDrawer({ flowId, history, ...props }) {
  const handleSubmit = () => history.goBack();
  // const classes = useStyles();

  return (
    <RightDrawerRouter {...props} path="schedule">
      <TitleBar history={history} title="Schedule" onSubmit={handleSubmit} />
      For flow: {flowId}
    </RightDrawerRouter>
  );
}
