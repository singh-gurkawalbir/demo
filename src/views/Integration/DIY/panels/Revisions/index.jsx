import React, { useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles, Typography } from '@material-ui/core';
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
  noRevisions: {
    padding: theme.spacing(2),
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
  const filteredRevisions = useSelector(state => selectors.filteredRevisions(state, integrationId));
  const isLoadingRevisions = useSelector(state => selectors.isLoadingRevisions(state, integrationId));
  const hasNoRevisions = useSelector(state => selectors.integrationHasNoRevisions(state, integrationId));

  if (isLoadingRevisions) {
    return <Spinner centerAll />;
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
          You don&apos;t have any revisions with this filters
        </Typography>
      );
    }

    return null;
  };

  return (
    <>
      <ResourceTable
        resourceType="revisions"
        filterKey={getRevisionFilterKey(integrationId)}
        resources={filteredRevisions}
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
