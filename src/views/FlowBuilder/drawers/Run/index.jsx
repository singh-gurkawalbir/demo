// import { makeStyles } from '@material-ui/core/styles';
import RightDrawer from '../RightDrawer';
import TitleBar from '../TitleBar';

// const useStyles = makeStyles(() => ({}));

export default function RunDrawer({ flowId, history, ...props }) {
  const handleSubmit = () => history.goBack();
  // const classes = useStyles();

  return (
    <RightDrawer {...props} path="run">
      <TitleBar
        history={history}
        title="Run"
        submitLabel="Run Flow"
        onSubmit={handleSubmit}
      />
      For flow: {flowId}
    </RightDrawer>
  );
}
