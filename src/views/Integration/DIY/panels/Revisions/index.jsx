import React, { useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core';
import { Link, useRouteMatch } from 'react-router-dom';
import { nanoid } from 'nanoid';
import { TextButton } from '../../../../../components/Buttons';
import actions from '../../../../../actions';
import { selectors } from '../../../../../reducers';
import { getRevisionFilterKey } from '../../../../../utils/revisions';
import PanelHeader from '../../../../../components/PanelHeader';
import ActionGroup from '../../../../../components/ActionGroup';
import AddIcon from '../../../../../components/icons/AddIcon';
import RevisionFilters from './RevisionFilters';
import ResourceTable from '../../../../../components/ResourceTable';
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

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.common.white,
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
    overflowX: 'auto',
  },
}));

function DrawerDeclarations({ integrationId, hasMonitorLevelAccess }) {
  if (hasMonitorLevelAccess) {
    <ViewDetailsDrawer integrationId={integrationId} />;
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

export default function Revisions({ integrationId }) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const match = useRouteMatch();
  const revisions = useSelector(state => selectors.filteredRevisions(state, integrationId));
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

  return (
    <div className={classes.root}>
      <PanelHeader title="Revisions" infoText="test" className={classes.flowPanelTitle}>
        { !hasMonitorLevelAccess && (
        <ActionGroup>
          <TextButton
            component={Link}
            disabled={isLoadingRevisions}
            startIcon={<AddIcon />}
            to={`${match.url}/pull/${nanoid()}/open`}
            data-test="createPull">
            Create pull
          </TextButton>
          <TextButton
            component={Link}
            startIcon={<AddIcon />}
            disabled={isLoadingRevisions}
            to={`${match.url}/snapshot/${nanoid()}/open`}
            data-test="createSnapshot">
            Create snapshot
          </TextButton>
        </ActionGroup>
        )}
      </PanelHeader>
      <RevisionFilters />
      {
        isLoadingRevisions ? <Spinner centerAll /> : (
          <ResourceTable
            resourceType="revisions"
            filterKey={getRevisionFilterKey(integrationId)}
            resources={revisions}
          />
        )
      }
      <LoadResources resources="flows,integrations">
        <DrawerDeclarations
          integrationId={integrationId}
          hasMonitorLevelAccess={hasMonitorLevelAccess}
       />
      </LoadResources>
    </div>
  );
}
