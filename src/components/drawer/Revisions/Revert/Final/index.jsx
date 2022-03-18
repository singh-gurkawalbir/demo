import React, { useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory, useRouteMatch } from 'react-router-dom';
import RightDrawer from '../../../Right';
import DrawerHeader from '../../../Right/DrawerHeader';
import DrawerContent from '../../../Right/DrawerContent';
import DrawerFooter from '../../../Right/DrawerFooter';
import { TextButton } from '../../../../Buttons';
import InstallSteps from '../../InstallSteps';
import RevisionHeader from '../../RevisionHeader';
import { REVISION_DRAWER_MODES } from '../../../../../utils/revisions';

const useStyles = makeStyles(() => ({
  drawerHeader: {
    '& > h4': {
      whiteSpace: 'nowrap',
    },
  },
}));

function FinalRevertDrawerContent({ parentUrl, integrationId }) {
  const match = useRouteMatch();
  const history = useHistory();
  const classes = useStyles();
  const { revId } = match.params;

  const onClose = useCallback(() => {
    history.replace(parentUrl);
  }, [history, parentUrl]);

  return (
    <>
      <DrawerHeader className={classes.drawerHeader} title="Revert changes" handleClose={onClose}>
        <RevisionHeader
          integrationId={integrationId}
          revisionId={revId}
          onClose={onClose}
          mode={REVISION_DRAWER_MODES.MERGE} />
      </DrawerHeader>
      <DrawerContent>
        <InstallSteps integrationId={integrationId} revisionId={revId} />
      </DrawerContent>
      <DrawerFooter>
        <TextButton
          data-test="cancelCreatePull"
          onClick={onClose}>
          Cancel
        </TextButton>
      </DrawerFooter>
    </>
  );
}

export default function FinalRevert({ integrationId }) {
  const match = useRouteMatch();

  return (
    <RightDrawer
      path="revert/:revId/final"
      variant="temporary"
      height="tall"
      width="full">
      <FinalRevertDrawerContent integrationId={integrationId} parentUrl={match.url} />
    </RightDrawer>
  );
}
