import { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import RightDrawer from '../../../../components/drawer/Right';
import FlowCharts from '../../../../components/FlowCharts';

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
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: 2,
  },
}));

export default function ScheduleDrawer({ flowId }) {
  const history = useHistory();
  const handleClose = useCallback(() => history.goBack(), [history]);
  const classes = useStyle();

  // TODO: Connector specific things to be added for schedule drawer incase of !isViewMode && isConnector
  return (
    <RightDrawer path="charts" width="xl" height="tall" title="Line Graph">
      <FlowCharts
        flowId={flowId}
        onClose={handleClose}
        className={classes.scheduleContainer}
      />
    </RightDrawer>
  );
}
