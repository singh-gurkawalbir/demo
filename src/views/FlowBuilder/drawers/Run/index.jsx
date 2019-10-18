// import { makeStyles } from '@material-ui/core/styles';
import RightDrawerRouter from '../RightDrawer';
import TitleBar from '../TitleBar';

// const useStyles = makeStyles(() => ({}));

export default function RunDrawer({ flowId, history, ...props }) {
  const handleSubmit = () => history.goBack();
  // const classes = useStyles();

  return (
    <RightDrawerRouter {...props} path="run">
      <TitleBar
        history={history}
        title="Run"
        submitLabel="Run Flow"
        onSubmit={handleSubmit}
      />
      For flow: {flowId}
    </RightDrawerRouter>
  );
}
