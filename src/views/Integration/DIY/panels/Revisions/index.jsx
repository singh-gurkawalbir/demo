import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles, Typography } from '@material-ui/core';
import { useRouteMatch } from 'react-router-dom';
import { generateId } from '../../../../../utils/string';
import { TextButton } from '../../../../../components/Buttons';
import actions from '../../../../../actions';
import { selectors } from '../../../../../reducers';
import { getRevisionFilterKey } from '../../../../../utils/revisions';
import { buildDrawerUrl, drawerPaths } from '../../../../../utils/rightDrawer';
import PanelHeader from '../../../../../components/PanelHeader';
import ActionGroup from '../../../../../components/ActionGroup';
import AddIcon from '../../../../../components/icons/AddIcon';
import RevisionFilters from './RevisionFilters';
import CeligoTable from '../../../../../components/CeligoTable';
import revisionsMetadata from '../../../../../components/ResourceTable/revisions/metadata';
import Spinner from '../../../../../components/Spinner';
import ViewDetailsDrawer from '../../../../../components/drawer/Revisions/ViewDetails';
import OpenPullDrawer from '../../../../../components/drawer/Revisions/Pull/Open';
import ReviewPullChangesDrawer from '../../../../../components/drawer/Revisions/Pull/ReviewChanges';
import MergePullDrawer from '../../../../../components/drawer/Revisions/Pull/Merge';
import OpenRevertDrawer from '../../../../../components/drawer/Revisions/Revert/Open';
import ReviewRevertChangesDrawer from '../../../../../components/drawer/Revisions/Revert/ReviewChanges';
import FinalRevertDrawer from '../../../../../components/drawer/Revisions/Revert/Final';
import CreateSnapshotDrawer from '../../../../../components/drawer/Revisions/CreateSnapshot';
import LoadResources from '../../../../../components/LoadResources';
import useOpenRevisionWhenValid from '../../../../../components/drawer/Revisions/hooks/useOpenRevisionWhenValid';
import infoText from '../infoText';
import customCloneDeep from '../../../../../utils/customCloneDeep';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
    overflowX: 'auto',
    paddingBottom: theme.spacing(2),
  },
  noRevisions: {
    padding: theme.spacing(3),
  },
}));

function DrawerDeclarations({ integrationId, hasMonitorLevelAccess }) {
  const isLoadingRevisions = useSelector(state => selectors.isLoadingRevisions(state, integrationId));

  if (isLoadingRevisions) {
    // to make sure drawers are not initialized before revisions are loaded
    return null;
  }

  if (hasMonitorLevelAccess) {
    return <ViewDetailsDrawer integrationId={integrationId} />;
  }

  return (
    <>
      <ViewDetailsDrawer integrationId={integrationId} />
      <OpenPullDrawer integrationId={integrationId} />
      <ReviewPullChangesDrawer integrationId={integrationId} />
      <MergePullDrawer integrationId={integrationId} />
      <OpenRevertDrawer integrationId={integrationId} />
      <ReviewRevertChangesDrawer integrationId={integrationId} />
      <FinalRevertDrawer integrationId={integrationId} />
      <CreateSnapshotDrawer integrationId={integrationId} />
    </>
  );
}

const RevisionsList = ({ integrationId }) => {
  const classes = useStyles();
  const filteredRevisions = useSelector(state => selectors.getCurrPageFilteredRevisions(state, integrationId));
  const isLoadingRevisions = useSelector(state => selectors.isLoadingRevisions(state, integrationId));
  const hasNoRevisions = useSelector(state => selectors.integrationHasNoRevisions(state, integrationId));

  if (isLoadingRevisions) {
    return <Spinner loading size="large" />;
  }

  const NoRevisionsInfo = () => {
    if (hasNoRevisions) {
      return (
        <Typography variant="body2" className={classes.noRevisions}>
          You don&apos;t have any revisions
        </Typography>
      );
    }
    if (!filteredRevisions.length) {
      return (
        <Typography variant="body2" className={classes.noRevisions}>
          Your selection didn&apos;t return any matching results. Try expanding your filter criteria.
        </Typography>
      );
    }

    return null;
  };

  return (
    <>
      <CeligoTable
        {...revisionsMetadata}
        filterKey={getRevisionFilterKey(integrationId)}
        data={customCloneDeep(filteredRevisions)}
      />
      <NoRevisionsInfo />
    </>
  );
};

export default function Revisions({ integrationId }) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const match = useRouteMatch();

  const hasMonitorLevelAccess = useSelector(state => selectors.isFormAMonitorLevelAccess(state, integrationId));
  const isLoadingRevisions = useSelector(state => {
    const status = selectors.revisionsFetchStatus(state, integrationId);

    return !status || status === 'requested';
  });
  const isRevisionsCollectionRequested = useSelector(state => !!selectors.revisionsFetchStatus(state, integrationId));

  useEffect(() => {
    if (!isRevisionsCollectionRequested) {
      dispatch(actions.integrationLCM.revisions.request(integrationId));
    }
  }, [integrationId, dispatch, isRevisionsCollectionRequested]);

  useEffect(() => {
    if (!hasMonitorLevelAccess) {
      dispatch(actions.integrationLCM.cloneFamily.request(integrationId));

      return () => dispatch(actions.integrationLCM.cloneFamily.clear(integrationId));
    }
  }, [dispatch, hasMonitorLevelAccess, integrationId]);

  const handleCreatePull = useOpenRevisionWhenValid({
    integrationId,
    drawerURL: buildDrawerUrl({
      path: drawerPaths.LCM.OPEN_PULL,
      baseUrl: match.url,
      params: { revId: generateId() },
    }),
    isCreatePull: true,
  });
  const handleCreateSnapshot = useOpenRevisionWhenValid({
    integrationId,
    drawerURL: buildDrawerUrl({
      path: drawerPaths.LCM.CREATE_SNAPSHOT,
      baseUrl: match.url,
      params: { revId: generateId() },
    }),
  });

  return (
    <div className={classes.root}>
      <PanelHeader title="Revisions" className={classes.flowPanelTitle} infoText={infoText.Revisions} contentId="revisions">
        { !hasMonitorLevelAccess && (
        <ActionGroup>
          <TextButton
            disabled={isLoadingRevisions}
            startIcon={<AddIcon />}
            onClick={handleCreatePull}
            data-test="createPull">
            Create pull
          </TextButton>
          <TextButton
            startIcon={<AddIcon />}
            disabled={isLoadingRevisions}
            onClick={handleCreateSnapshot}
            data-test="createSnapshot">
            Create snapshot
          </TextButton>
        </ActionGroup>
        )}
      </PanelHeader>
      <RevisionFilters />
      <RevisionsList integrationId={integrationId} />
      <LoadResources resources="flows,integrations">
        <DrawerDeclarations
          integrationId={integrationId}
          hasMonitorLevelAccess={hasMonitorLevelAccess}
       />
      </LoadResources>
    </div>
  );
}
