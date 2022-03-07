import React, { useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core';
import { Link, useRouteMatch } from 'react-router-dom';
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

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.common.white,
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
    overflowX: 'auto',
  },
}));

export default function Revisions({ integrationId }) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const match = useRouteMatch();
  const revisions = useSelector(state => selectors.filteredRevisions(state, integrationId));
  const isLoadingRevisions = useSelector(state => {
    const status = selectors.revisionsFetchStatus(state, integrationId);

    return !status || status === 'requested';
  });

  useEffect(() => {
    dispatch(actions.integrationLCM.revisions.request(integrationId));

    return () => dispatch(actions.integrationLCM.revisions.clear(integrationId));
  }, [integrationId, dispatch]);

  return (
    <div className={classes.root}>
      <PanelHeader title="Revisions" infoText="test" className={classes.flowPanelTitle}>
        <ActionGroup>
          <TextButton
            component={Link}
            disabled={isLoadingRevisions}
            startIcon={<AddIcon />}
            to={`${match.url}/pull/new-123/open`}
            data-test="createPull">
            Create pull
          </TextButton>
          <TextButton
            component={Link}
            startIcon={<AddIcon />}
            disabled={isLoadingRevisions}
            to={`${match.url}/snapshot/new-123/open`}
            data-test="createSnapshot">
            Create snapshot
          </TextButton>
        </ActionGroup>
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
      <ViewDetailsDrawer />
      <OpenPullDrawer />
      <ReviewPullChangesDrawer />
      <MergePullDrawer />
      <OpenRevertDrawer />
      <ReviewRevertChangesDrawer />
      <FinalRevertDrawer />
      <CreateSnapshotDrawer />
    </div>
  );
}
