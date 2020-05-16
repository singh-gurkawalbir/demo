import { Drawer, makeStyles } from '@material-ui/core';
import { useCallback, useState } from 'react';
import { useRouteMatch, useHistory, Route } from 'react-router-dom';
import FlowCharts from './FlowCharts';
import DrawerTitleBar from './TitleBar';

const useStyles = makeStyles(theme => ({
  drawerPaper: {
    width: '1300px',
    marginTop: theme.appBarHeight + theme.pageBarHeight,
    border: 'solid 1px',
    borderColor: theme.palette.secondary.lightest,
    boxShadow: `-4px 4px 8px rgba(0,0,0,0.15)`,
    zIndex: theme.zIndex.drawer + 1,
  },
  form: {
    maxHeight: `calc(100vh - 180px)`,
    padding: theme.spacing(2, 3),
  },
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

function LineGraphDrawer({ parentUrl, flowId }) {
  const match = useRouteMatch();
  const classes = useStyles();
  const history = useHistory();
  const [selectedMeasurements, setSelectedMeasurements] = useState(['success']);
  const [selectedResources, setSelectedResources] = useState([flowId]);
  const handleClose = useCallback(() => {
    history.push(parentUrl);
  }, [history, parentUrl]);
  const handleMeasurementsChange = useCallback(val => {
    setSelectedMeasurements(val);
  }, []);
  const handleResourceChange = useCallback(val => {
    setSelectedResources(val);
  }, []);

  return (
    <Drawer
      anchor="right"
      classes={{
        paper: classes.drawerPaper,
      }}
      BackdropProps={{ invisible: true }}
      open={!!match}>
      <DrawerTitleBar
        title="Dashboard"
        flowId={flowId}
        onMeasurementsChange={handleMeasurementsChange}
        onResourcesChange={handleResourceChange}
        measurements={selectedMeasurements}
        selectedResources={selectedResources}
        onClose={handleClose}
        backToParent
      />
      <FlowCharts
        flowId={flowId}
        selectedMeasurements={selectedMeasurements}
        selectedResources={selectedResources}
        className={classes.scheduleContainer}
      />
    </Drawer>
  );
}

export default function LineGraphDrawerRoute({ flowId }) {
  const match = useRouteMatch();

  return (
    <Route exact path={`${match.url}/charts`}>
      <LineGraphDrawer flowId={flowId} parentUrl={match.url} />
    </Route>
  );
}
