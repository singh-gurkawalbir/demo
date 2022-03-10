import React, { useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
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
import ResourceDiffVisualizer from '../../../../ResourceDiffVisualizer';
import { getRevisionResourceLevelChanges } from '../../../../../utils/revisions';

function ReviewRevertChangesDrawerContent({ integrationId, parentUrl }) {
  const match = useRouteMatch();
  const { tempRevId } = match.params;
  const history = useHistory();
  const dispatch = useDispatch();

  // selectors
  const createdRevisionId = useSelector(state => selectors.createdResourceId(state, tempRevId));
  const isRevisionCreationInProgress = useSelector(state => selectors.isRevisionCreationInProgress(state, integrationId, tempRevId));
  const isResourceComparisonInProgress = useSelector(state => selectors.isResourceComparisonInProgress(state, integrationId));
  const revisionResourceDiff = useSelector(state => selectors.revisionResourceDiff(state, integrationId));
  const isDiffExpanded = useSelector(state => selectors.isDiffExpanded(state, integrationId));
  // end selectors

  const resourceDiffInfo = useMemo(() => {
    if (revisionResourceDiff) {
      return getRevisionResourceLevelChanges(revisionResourceDiff);
    }
  }, [revisionResourceDiff]);

  const onClose = () => {
    history.replace(parentUrl);
  };
  const handleCreateRevision = () => {
    dispatch(actions.integrationLCM.revision.create(integrationId, tempRevId));
  };

  useEffect(() => {
    if (createdRevisionId) {
      history.replace(`${parentUrl}/revert/${createdRevisionId}/final`);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createdRevisionId]);

  useEffect(() => {
    dispatch(actions.integrationLCM.compare.revertRequest(integrationId, tempRevId));

    return () => dispatch(actions.integrationLCM.compare.clear(integrationId));
  }, [dispatch, integrationId, tempRevId]);

  return (
    <>
      <DrawerHeader title="Review changes" handleClose={onClose}>
        <ReviewHeaderActions
          integrationId={integrationId}
          revId={tempRevId}
        />
      </DrawerHeader>
      <DrawerContent>
        {
          isResourceComparisonInProgress ? <Spinner /> : (
            <ResourceDiffVisualizer
              diffs={resourceDiffInfo?.diffs}
              forceExpand={isDiffExpanded}
            />
          )
        }
      </DrawerContent>
      <DrawerFooter>
        <FilledButton disabled={isRevisionCreationInProgress} onClick={handleCreateRevision} >
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

export default function ReviewRevertChangesDrawer({ integrationId }) {
  const match = useRouteMatch();

  return (
    <RightDrawer
      path="revert/:tempRevId/review"
      variant="temporary"
      height="tall"
      width="full">
      <ReviewRevertChangesDrawerContent integrationId={integrationId} parentUrl={match.url} />
    </RightDrawer>
  );
}
