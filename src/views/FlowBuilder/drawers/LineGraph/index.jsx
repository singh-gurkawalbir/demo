import { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import RightDrawer from '../../../../components/drawer/Right';
import FlowCharts from '../../../../components/FlowCharts';
import titleBar from '../../../../components/FlowCharts/TitleBar';

const useStyle = makeStyles(theme => ({
  scheduleContainer: {
    width: '100%',
    overflowX: 'hidden',
    marginTop: -1,
    padding: theme.spacing(-1),
    '& > div': {
      padding: theme.spacing(3, 0),
    },
  },
}));

export default function FlowChartsDrawer({ flowId }) {
  const history = useHistory();
  const handleClose = useCallback(() => history.goBack(), [history]);
  const classes = useStyle();

  return (
    <RightDrawer
      TitleBar={titleBar}
      path="charts"
      width="xl"
      onClose={handleClose}
      flowId={flowId}
      height="tall"
      title="Dashboard">
      <FlowCharts
        flowId={flowId}
        onClose={handleClose}
        className={classes.scheduleContainer}
      />
    </RightDrawer>
  );
}
