import React, { useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, useRouteMatch } from 'react-router-dom';
import RightDrawer from '../../../Right';
import DrawerHeader from '../../../Right/DrawerHeader';
import DrawerContent from '../../../Right/DrawerContent';
import DrawerFooter from '../../../Right/DrawerFooter';
import Spinner from '../../../../Spinner';
import ResourceDiffVisualizer from '../../../../ResourceDiffVisualizer';
import { TextButton, FilledButton } from '../../../../Buttons';
import actions from '../../../../../actions';
import { selectors } from '../../../../../reducers';
import { getRevisionResourceLevelChanges } from '../../../../../utils/revisions';

function ReviewChangesDrawerContent({ integrationId, parentUrl }) {
  const match = useRouteMatch();
  const { revId } = match.params;
  const history = useHistory();
  const dispatch = useDispatch();

  const createdRevisionId = useSelector(state => selectors.createdResourceId(state, revId));
  const isRevisionCreationInProgress = useSelector(state => selectors.isRevisionCreationInProgress(state, integrationId, revId));
  const isResourceComparisonInProgress = useSelector(state => selectors.isResourceComparisonInProgress(state, integrationId));
  const revisionResourceDiff = useSelector(state => selectors.revisionResourceDiff(state, integrationId));
  const resourceDiffInfo = useMemo(() => {
    if (revisionResourceDiff) {
      return getRevisionResourceLevelChanges(revisionResourceDiff);
    }
  }, [revisionResourceDiff]);

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
  }, [dispatch, integrationId, revId]);

  return (
    <>
      <DrawerHeader title="Review changes " handleClose={onClose} />
      <DrawerContent>
        {
          isResourceComparisonInProgress ? <Spinner /> : (
            <ResourceDiffVisualizer diffs={resourceDiffInfo?.diffs} />
          )
        }
      </DrawerContent>
      <DrawerFooter>
        <FilledButton disabled={isRevisionCreationInProgress || isResourceComparisonInProgress} onClick={handleCreateRevision} >
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
      width="xl">
      <ReviewChangesDrawerContent integrationId={integrationId} parentUrl={match.url} />
    </RightDrawer>
  );
}
