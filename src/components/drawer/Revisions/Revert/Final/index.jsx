import React, { useCallback } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import {
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@celigo/fuse-ui';
import Help from '../../../../Help';
import RightDrawer from '../../../Right';
import { FilledButton } from '../../../../Buttons';
import InstallSteps from '../../components/InstallSteps';
import RevisionHeader from '../../components/RevisionHeader';
import { REVISION_DRAWER_MODES } from '../../../../../utils/revisions';
import useHandleInvalidRevision from '../../hooks/useHandleInvalidRevision';
import { drawerPaths } from '../../../../../utils/rightDrawer';

function FinalRevertDrawerContent({ parentUrl, integrationId }) {
  const match = useRouteMatch();
  const history = useHistory();
  const { revisionId } = match.params;

  useHandleInvalidRevision({ integrationId, revisionId, parentUrl });

  const onClose = useCallback(() => {
    history.replace(parentUrl);
  }, [history, parentUrl]);

  return (
    <>
      <DrawerHeader sx={{ whiteSpace: 'nowrap' }}>
        <DrawerTitle>
          Revert changes
          <Help title="Revert changes" helpKey="revert.finalRevertChanges" size="small" />
        </DrawerTitle>
        <RevisionHeader
          integrationId={integrationId}
          revisionId={revisionId}
          onClose={onClose}
          mode={REVISION_DRAWER_MODES.INSTALL} />
        <DrawerCloseButton onClick={onClose} />
      </DrawerHeader>
      <DrawerContent withPadding>
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
      isIntegrated
      path={drawerPaths.LCM.FINAL_REVERT_STEP}
      height="tall"
      width="xl">
      <FinalRevertDrawerContent integrationId={integrationId} parentUrl={match.url} />
    </RightDrawer>
  );
}
