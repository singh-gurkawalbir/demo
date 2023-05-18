import React, { useCallback } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { FilledButton } from '@celigo/fuse-ui';
import RightDrawer from '../../../Right';
import DrawerHeader from '../../../Right/DrawerHeader';
import DrawerContent from '../../../Right/DrawerContent';
import DrawerFooter from '../../../Right/DrawerFooter';
import InstallSteps from '../../components/InstallSteps';
import RevisionHeader from '../../components/RevisionHeader';
import { REVISION_DRAWER_MODES } from '../../../../../utils/revisions';
import useHandleInvalidRevision from '../../hooks/useHandleInvalidRevision';
import { drawerPaths } from '../../../../../utils/rightDrawer';

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
  const { revisionId } = match.params;

  useHandleInvalidRevision({ integrationId, revisionId, parentUrl });

  const onClose = useCallback(() => {
    history.replace(parentUrl);
  }, [history, parentUrl]);

  return (
    <>
      <DrawerHeader
        className={classes.drawerHeader}
        helpKey="revert.finalRevertChanges"
        title="Revert changes"
        handleClose={onClose}>
        <RevisionHeader
          integrationId={integrationId}
          revisionId={revisionId}
          onClose={onClose}
          mode={REVISION_DRAWER_MODES.INSTALL} />
      </DrawerHeader>
      <DrawerContent>
        <InstallSteps
          onClose={onClose}
          integrationId={integrationId}
          revisionId={revisionId} />
      </DrawerContent>
      <DrawerFooter>
        <FilledButton
          data-test="cancelFinalRevert"
          onClick={onClose}>
          Close
        </FilledButton>
      </DrawerFooter>
    </>
  );
}

export default function FinalRevert({ integrationId }) {
  const match = useRouteMatch();

  return (
    <RightDrawer
      path={drawerPaths.LCM.FINAL_REVERT_STEP}
      height="tall"
      width="xl">
      <FinalRevertDrawerContent integrationId={integrationId} parentUrl={match.url} />
    </RightDrawer>
  );
}
