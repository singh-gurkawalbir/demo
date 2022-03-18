import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {makeStyles} from '@material-ui/core/styles';
import { useHistory, useRouteMatch } from 'react-router-dom';
import RightDrawer from '../../../Right';
import DrawerHeader from '../../../Right/DrawerHeader';
import DrawerContent from '../../../Right/DrawerContent';
import DrawerFooter from '../../../Right/DrawerFooter';
import Spinner from '../../../../Spinner';
import { TextButton, FilledButton } from '../../../../Buttons';
import actions from '../../../../../actions';
import { selectors } from '../../../../../reducers';
import ReviewHeaderActions from './ReviewHeaderActions';
import ResourceDiffDrawerContent from '../../ResourceDiffDrawerContent';

const useStyles = makeStyles(() => ({
  drawerHeader: {
    '& > h4': {
      whiteSpace: 'nowrap',
    },
  },
}));

function ReviewChangesDrawerContent({ integrationId, parentUrl }) {
  const match = useRouteMatch();
  const classes = useStyles();
  const { revId } = match.params;
  const history = useHistory();
  const dispatch = useDispatch();
  // selectors
  const createdRevisionId = useSelector(state => selectors.createdResourceId(state, revId));
  const isRevisionCreationInProgress = useSelector(state => selectors.isRevisionCreationInProgress(state, integrationId, revId));
  const hasReceivedResourceDiff = useSelector(state => selectors.hasReceivedResourceDiff(state, integrationId));
  const numConflicts = useSelector(state => selectors.revisionResourceDiff(state, integrationId)?.numConflicts);
  // end selectors

  const onClose = () => {
    history.replace(parentUrl);
  };
  const handleCreateRevision = () => {
    dispatch(actions.integrationLCM.revision.create(integrationId, revId));
  };

  useEffect(() => {
    if (createdRevisionId) {
      history.replace(`${parentUrl}/pull/${createdRevisionId}/merge`);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createdRevisionId]);

  useEffect(() => {
    dispatch(actions.integrationLCM.compare.pullRequest(integrationId, revId));

    return () => dispatch(actions.integrationLCM.compare.clear(integrationId));
  }, [dispatch, integrationId, revId]);

  return (
    <>
      <DrawerHeader
        title="Review changes"
        className={classes.drawerHeader}
        infoText="test"
        handleClose={onClose}>
        <ReviewHeaderActions
          numConflicts={numConflicts}
          integrationId={integrationId}
          revId={revId}
        />
      </DrawerHeader>
      <DrawerContent>
        <ResourceDiffDrawerContent integrationId={integrationId} />
      </DrawerContent>
      <DrawerFooter>
        <FilledButton disabled={isRevisionCreationInProgress || !hasReceivedResourceDiff} onClick={handleCreateRevision} >
          Next { isRevisionCreationInProgress ? <Spinner size={12} /> : null }
        </FilledButton>
        <TextButton
          data-test="cancelCreatePull"
          disabled={isRevisionCreationInProgress}
          onClick={onClose}>
          Cancel
        </TextButton>
      </DrawerFooter>
    </>
  );
}

export default function ReviewChangesDrawer({ integrationId }) {
  const match = useRouteMatch();

  return (
    <RightDrawer
      path="pull/:revId/review"
      variant="temporary"
      height="tall"
      width="full">
      <ReviewChangesDrawerContent integrationId={integrationId} parentUrl={match.url} />
    </RightDrawer>
  );
}
