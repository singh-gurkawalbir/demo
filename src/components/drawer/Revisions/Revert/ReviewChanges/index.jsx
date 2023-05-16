import React, { useEffect } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { Spinner, TextButton, FilledButton } from '@celigo/fuse-ui';
import RightDrawer from '../../../Right';
import DrawerHeader from '../../../Right/DrawerHeader';
import DrawerContent from '../../../Right/DrawerContent';
import DrawerFooter from '../../../Right/DrawerFooter';
import actions from '../../../../../actions';
import { selectors } from '../../../../../reducers';
import { REVISION_DRAWER_MODES, hasInvalidRevertResourceDiff } from '../../../../../utils/revisions';
import RevisionHeader from '../../components/RevisionHeader';
import ResourceDiffDrawerContent from '../../components/ResourceDiffContent';
import useHandleInvalidNewRevision from '../../hooks/useHandleInvalidNewRevision';
import { drawerPaths, buildDrawerUrl } from '../../../../../utils/rightDrawer';

const useStyles = makeStyles(() => ({
  drawerHeader: {
    '& > h4': {
      whiteSpace: 'nowrap',
    },
  },
}));

function ReviewRevertChangesDrawerContent({ integrationId, parentUrl }) {
  const match = useRouteMatch();
  const classes = useStyles();
  const { revisionId } = match.params;
  const history = useHistory();
  const dispatch = useDispatch();

  useHandleInvalidNewRevision({ integrationId, revisionId, parentUrl });

  // selectors
  const createdRevisionId = useSelector(state => selectors.createdResourceId(state, revisionId));
  const isRevisionCreationInProgress = useSelector(state => selectors.isRevisionCreationInProgress(state, integrationId, revisionId));
  const hasReceivedResourceDiff = useSelector(state => selectors.hasReceivedResourceDiff(state, integrationId));
  const hasInvalidResourceDiff = useSelector(state => {
    const revisionResourceDiff = selectors.revisionResourceDiff(state, integrationId);

    return hasReceivedResourceDiff && hasInvalidRevertResourceDiff(revisionResourceDiff);
  });
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
        path: drawerPaths.LCM.FINAL_REVERT_STEP,
        baseUrl: parentUrl,
        params: { revisionId: createdRevisionId},
      }));
    }
  }, [createdRevisionId, history, parentUrl]);

  useEffect(() => {
    dispatch(actions.integrationLCM.compare.revertRequest(integrationId, revisionId));

    return () => dispatch(actions.integrationLCM.compare.clear(integrationId));
  }, [dispatch, integrationId, revisionId]);

  const isRevisionCreationDisabled = isRevisionCreationInProgress || !hasReceivedResourceDiff || hasInvalidResourceDiff;

  return (
    <>
      <DrawerHeader
        title="Review changes"
        handleClose={onClose}
        className={classes.drawerHeader}
        helpKey="revert.reviewChanges"
      >
        <RevisionHeader
          integrationId={integrationId}
          revisionId={revisionId}
          mode={REVISION_DRAWER_MODES.REVIEW}
        />
      </DrawerHeader>
      <DrawerContent>
        <ResourceDiffDrawerContent integrationId={integrationId} type="revert" />
      </DrawerContent>
      <DrawerFooter>
        <FilledButton
          disabled={isRevisionCreationDisabled}
          onClick={handleCreateRevision}
          endIcon={isRevisionCreationInProgress ? <Spinner size="small" sx={{ml: 1}} /> : null}
        >
          Next
        </FilledButton>
        <TextButton
          data-test="cancelReviewRevert"
          disabled={isRevisionCreationInProgress}
          onClick={onClose}>
          Close
        </TextButton>
      </DrawerFooter>
    </>
  );
}

export default function ReviewRevertChangesDrawer({ integrationId }) {
  const match = useRouteMatch();

  return (
    <RightDrawer
      path={drawerPaths.LCM.REVIEW_REVERT_CHANGES}
      height="tall"
      width="xl">
      <ReviewRevertChangesDrawerContent integrationId={integrationId} parentUrl={match.url} />
    </RightDrawer>
  );
}
