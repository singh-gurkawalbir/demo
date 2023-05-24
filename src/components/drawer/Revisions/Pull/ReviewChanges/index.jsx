import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, useRouteMatch } from 'react-router-dom';
import {
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  Spinner,
  TextButton,
  FilledButton,
  Divider,
} from '@celigo/fuse-ui';
import Help from '../../../../Help';
import RightDrawer from '../../../Right';
import actions from '../../../../../actions';
import { REVISION_DRAWER_MODES } from '../../../../../utils/revisions';
import { selectors } from '../../../../../reducers';
import RevisionHeader from '../../components/RevisionHeader';
import ResourceDiffDrawerContent from '../../components/ResourceDiffContent';
import useHandleInvalidNewRevision from '../../hooks/useHandleInvalidNewRevision';
import { drawerPaths, buildDrawerUrl } from '../../../../../utils/rightDrawer';

function ReviewChangesDrawerContent({ integrationId, parentUrl }) {
  const match = useRouteMatch();
  const { revisionId } = match.params;
  const history = useHistory();
  const dispatch = useDispatch();

  useHandleInvalidNewRevision({ integrationId, revisionId, parentUrl });

  // selectors
  const createdRevisionId = useSelector(state => selectors.createdResourceId(state, revisionId));
  const isRevisionCreationInProgress = useSelector(state => selectors.isRevisionCreationInProgress(state, integrationId, revisionId));
  const hasReceivedResourceDiff = useSelector(state => selectors.hasReceivedResourceDiff(state, integrationId));
  // end selectors

  const onClose = () => {
    history.replace(parentUrl);
  };
  const handleCreateRevision = () => {
    dispatch(actions.integrationLCM.revision.create(integrationId, revisionId));
  };

  useEffect(() => {
    if (createdRevisionId) {
      history.replace(buildDrawerUrl({
        path: drawerPaths.LCM.MERGE_PULL_CHANGES,
        baseUrl: parentUrl,
        params: { revisionId: createdRevisionId },
      }));
    }
  }, [createdRevisionId, history, parentUrl]);

  useEffect(() => {
    dispatch(actions.integrationLCM.compare.pullRequest(integrationId, revisionId));

    return () => dispatch(actions.integrationLCM.compare.clear(integrationId));
  }, [dispatch, integrationId, revisionId]);

  return (
    <>
      <DrawerHeader>
        <DrawerTitle>
          Review changes
          <Help helpKey="pull.reviewChanges" size="small" />
        </DrawerTitle>
        <RevisionHeader
          integrationId={integrationId}
          revisionId={revisionId}
          mode={REVISION_DRAWER_MODES.REVIEW}
        />
        <Divider orientation="vertical" />
        <DrawerCloseButton onClick={onClose} />
      </DrawerHeader>
      <DrawerContent>
        <ResourceDiffDrawerContent integrationId={integrationId} type="pull" parentUrl={parentUrl} />
      </DrawerContent>
      <DrawerFooter>
        <FilledButton
          startIcon={isRevisionCreationInProgress ? (
            <Spinner
              size="small"
              sx={{mr: 0.5, height: 16}}
            />
          ) : null}
          disabled={isRevisionCreationInProgress || !hasReceivedResourceDiff}
          onClick={handleCreateRevision}
        >
          Next
        </FilledButton>
        <TextButton
          data-test="cancelReviewPulll"
          disabled={isRevisionCreationInProgress}
          onClick={onClose}>
          Close
        </TextButton>
      </DrawerFooter>
    </>
  );
}

export default function ReviewChangesDrawer({ integrationId }) {
  const match = useRouteMatch();

  return (
    <RightDrawer
      isIntegrated
      path={drawerPaths.LCM.REVIEW_PULL_CHANGES}
      height="tall"
      width="xl">
      <ReviewChangesDrawerContent integrationId={integrationId} parentUrl={match.url} />
    </RightDrawer>
  );
}
