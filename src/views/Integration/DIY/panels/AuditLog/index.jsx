import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import AuditLog from '../../../../../components/AuditLog';
import PanelHeader from '../../../../../components/PanelHeader';
import actions from '../../../../../actions';
import { selectors } from '../../../../../reducers';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.common.white,
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
  const isLoadingRevisions = useSelector(state => {
    const status = selectors.revisionsFetchStatus(state, integrationId);

    return !status || status === 'requested';
  });

  const isRevisionsCollectionRequested = useSelector(state =>
    !!selectors.revisionsFetchStatus(state, integrationId)
  );

  useEffect(() => {
    if (!isRevisionsCollectionRequested) {
      dispatch(actions.integrationLCM.revisions.request(integrationId));
    }
  }, [integrationId, dispatch, isRevisionsCollectionRequested]);

  return !isLoadingRevisions;
}

export default function AuditLogSection({ integrationId, childId }) {
  const infoTextAuditLog =
    'Keep track of changes to your integration, enabling you to track down problems based on changes to your integration or its flows. Know exactly who made the change, what the change was, and when it happened.';
  const classes = useStyles();

  // Loads revision list to show the details in the Audit log
  useLoadRevisions(integrationId);

  return (
    <div className={classes.root}>
      <PanelHeader title="Audit log" infoText={infoTextAuditLog} />
      <AuditLog resourceType="integrations" resourceId={childId || integrationId} childId={childId} />
    </div>
  );
}
