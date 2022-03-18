import React, { useEffect } from 'react';
import {makeStyles} from '@material-ui/core/styles';
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
import ResourceDiffDrawerContent from '../../ResourceDiffDrawerContent';

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
  const { tempRevId } = match.params;
  const history = useHistory();
  const dispatch = useDispatch();

  // selectors
  const createdRevisionId = useSelector(state => selectors.createdResourceId(state, tempRevId));
  const isRevisionCreationInProgress = useSelector(state => selectors.isRevisionCreationInProgress(state, integrationId, tempRevId));
  const hasReceivedResourceDiff = useSelector(state => selectors.hasReceivedResourceDiff(state, integrationId));
  // end selectors

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
      <DrawerHeader
        title="Review changes"
        handleClose={onClose}
        className={classes.drawerHeader}
        infoText="test"
      >
        <ReviewHeaderActions
          integrationId={integrationId}
          revId={tempRevId}
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
