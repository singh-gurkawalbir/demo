import React, { useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core';
import { Link, useRouteMatch } from 'react-router-dom';
import { TextButton } from '../../../../../components/Buttons';
import actions from '../../../../../actions';
import { selectors } from '../../../../../reducers';
import PanelHeader from '../../../../../components/PanelHeader';
import ActionGroup from '../../../../../components/ActionGroup';
import AddIcon from '../../../../../components/icons/AddIcon';
import RevisionFilters from './RevisionFilters';
import ResourceTable from '../../../../../components/ResourceTable';
import Spinner from '../../../../../components/Spinner';

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
  const revisions = useSelector(state => selectors.revisions(state, integrationId));
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
            to={`${match.url}/pull`}
            data-test="createPull">
            Create pull
          </TextButton>
          <TextButton
            component={Link}
            startIcon={<AddIcon />}
            disabled={isLoadingRevisions}
            to={`${match.url}/snapshot`}
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
            resources={revisions}
          />
        )
      }
    </div>
  );
}
