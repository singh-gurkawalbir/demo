import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import makeStyles from '@mui/styles/makeStyles';
import AuditLog from '../../../../../components/AuditLog';
import PanelHeader from '../../../../../components/PanelHeader';
import actions from '../../../../../actions';
import { selectors } from '../../../../../reducers';
import { STANDALONE_INTEGRATION } from '../../../../../constants';
import infoText from '../infoText';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
    overflowX: 'auto',
    minHeight: 124,
    marginBottom: theme.spacing(12),
  },
}));

function useLoadRevisions(integrationId) {
  // move this hook to a global folder when there are much more use cases to load revisions
  const dispatch = useDispatch();
  const revisionsFetchStatus = useSelector(state => selectors.revisionsFetchStatus(state, integrationId));
  const isIntegrationApp = useSelector(state => selectors.isIntegrationApp(state, integrationId));

  useEffect(() => {
    if (!revisionsFetchStatus && !isIntegrationApp && integrationId && STANDALONE_INTEGRATION.id !== integrationId) {
      dispatch(actions.integrationLCM.revisions.request(integrationId));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [integrationId, dispatch, revisionsFetchStatus]);

  return !revisionsFetchStatus || revisionsFetchStatus === 'requested';
}

export default function AuditLogSection({ integrationId, childId }) {
  const classes = useStyles();

  // Loads revision list to show the details in the Audit log
  useLoadRevisions(integrationId);

  return (
    <div className={classes.root}>
      <PanelHeader title="Audit log" infoText={infoText.AuditLog} />
      <AuditLog
        resourceType="integrations"
        resourceId={childId || integrationId}
        integrationId={childId || integrationId}
        childId={childId} />
    </div>
  );
}
