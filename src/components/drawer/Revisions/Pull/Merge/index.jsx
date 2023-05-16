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
import InstallSteps from '../../components/InstallSteps';
import RevisionHeader from '../../components/RevisionHeader';
import { REVISION_DRAWER_MODES } from '../../../../../utils/revisions';
import FilledButton from '../../../../Buttons/FilledButton';
import useHandleInvalidRevision from '../../hooks/useHandleInvalidRevision';
import { drawerPaths } from '../../../../../utils/rightDrawer';

function MergePullDrawerContent({ parentUrl, integrationId }) {
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
          Merge changes
          <Help helpKey="pull.mergeChanges" size="small" />
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
          data-test="cancelMerge"
          onClick={onClose}>
          Close
        </FilledButton>
      </DrawerFooter>
    </>
  );
}

export default function MergePullDrawer({ integrationId }) {
  const match = useRouteMatch();

  return (
    <RightDrawer
      isIntegrated
      path={drawerPaths.LCM.MERGE_PULL_CHANGES}
      height="tall"
      width="xl">
      <MergePullDrawerContent integrationId={integrationId} parentUrl={match.url} />
    </RightDrawer>
  );
}
