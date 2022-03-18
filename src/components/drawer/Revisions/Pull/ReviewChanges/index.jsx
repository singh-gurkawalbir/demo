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
import { REVISION_DRAWER_MODES } from '../../../../../utils/revisions';
import { selectors } from '../../../../../reducers';
import RevisionHeader from '../../RevisionHeader';
import ResourceDiffDrawerContent from '../../ResourceDiffContent';

const useStyles = makeStyles(theme => ({
  drawerHeaderWrapper: {
    '& > h4': {
      whiteSpace: 'nowrap',
    },
    '& > :not(:last-child)': {
      marginRight: 0,
    },
  },
  inProgressSpinner: {
    marginRight: theme.spacing(0.5),
    height: theme.spacing(2),
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
        className={classes.drawerHeaderWrapper}
        infoText="test"
        handleClose={onClose}>
        <RevisionHeader
          integrationId={integrationId}
          revisionId={revId}
          mode={REVISION_DRAWER_MODES.REVIEW}
        />
      </DrawerHeader>
      <DrawerContent>
        <ResourceDiffDrawerContent integrationId={integrationId} />
      </DrawerContent>
      <DrawerFooter>
        <FilledButton disabled={isRevisionCreationInProgress || !hasReceivedResourceDiff} onClick={handleCreateRevision} >
          { isRevisionCreationInProgress ? <Spinner size="small" className={classes.inProgressSpinner} /> : null } Next
        </FilledButton>
        <TextButton
          data-test="cancelCreatePull"
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
      path="pull/:revId/review"
      variant="temporary"
      height="tall"
      width="xl">
      <ReviewChangesDrawerContent integrationId={integrationId} parentUrl={match.url} />
    </RightDrawer>
  );
}
