import { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import RightDrawer from '../../../../components/drawer/Right';
import FlowSchedule from '../../../../components/FlowSchedule';

const useStyle = makeStyles(theme => ({
  scheduleContainer: {
    width: '100%',
    overflowX: 'hidden',
    marginTop: -1,
    padding: theme.spacing(-1),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: 2,
  },
}));

export default function ScheduleDrawer({
  integrationId,
  resourceType,
  resourceId,
  flow,
}) {
  const history = useHistory();
  const handleClose = useCallback(() => history.goBack(), [history]);
  const classes = useStyle();

  // TODO: Connector specific things to be added for schedule drawer incase of !isViewMode && isIntegrationApp
  return (
    <RightDrawer path="schedule" width="medium" title="Flow schedule">
      <FlowSchedule
        integrationId={integrationId}
        resourceType={resourceType}
        resourceId={resourceId}
        flow={flow}
        onClose={handleClose}
        className={classes.scheduleContainer}
      />
    </RightDrawer>
  );
}
