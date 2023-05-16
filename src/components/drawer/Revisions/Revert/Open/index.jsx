import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouteMatch, useHistory } from 'react-router-dom';
import {
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  TextButton,
} from '@celigo/fuse-ui';
import Help from '../../../../Help';
import RightDrawer from '../../../Right';
import actions from '../../../../../actions';
import useFormInitWithPermissions from '../../../../../hooks/useFormInitWithPermissions';
import DynaForm from '../../../../DynaForm';
import DynaSubmit from '../../../../DynaForm/DynaSubmit';
import {selectors } from '../../../../../reducers';
import getMetadata from './metadata';
import RevisionHeader from '../../components/RevisionHeader';
import useHandleInvalidRevision from '../../hooks/useHandleInvalidRevision';
import { buildDrawerUrl, drawerPaths } from '../../../../../utils/rightDrawer';

function OpenRevertDrawerContent({ integrationId, parentUrl }) {
  const match = useRouteMatch();
  const { tempRevId, revertTo, revisionId } = match.params;
  const history = useHistory();
  const dispatch = useDispatch();

  useHandleInvalidRevision({ integrationId, revisionId, parentUrl });

  const revertToRevision = useSelector(state => selectors.revision(state, integrationId, revisionId));
  const formKey = useFormInitWithPermissions({ fieldMeta: getMetadata(revertToRevision) });

  const onClose = () => {
    history.replace(parentUrl);
  };

  const handleCreateRevision = formValues => {
    const revertToConfig = { revertTo, revisionId };
    const revisionInfo = {
      ...formValues,
      revertToConfig,
    };

    dispatch(actions.integrationLCM.revision.openRevert({ integrationId, newRevisionId: tempRevId, revisionInfo }));
    history.replace(buildDrawerUrl({
      path: drawerPaths.LCM.REVIEW_REVERT_CHANGES,
      baseUrl: parentUrl,
      params: { revisionId: tempRevId },
    }));
  };

  return (
    <>
      <DrawerHeader sx={{ whiteSpace: 'nowrap' }}>
        <DrawerTitle>
          Create revert
          <Help title="Create revert" helpKey="revert.create" size="small" />
        </DrawerTitle>
        <RevisionHeader />
        <DrawerCloseButton onClick={onClose} />
      </DrawerHeader>
      <DrawerContent withPadding>
        <DynaForm formKey={formKey} />
      </DrawerContent>
      <DrawerFooter>
        <DynaSubmit formKey={formKey} onClick={handleCreateRevision} >
          Next
        </DynaSubmit>
        <TextButton
          data-test="cancelCreateRevert"
          onClick={onClose}>
          Close
        </TextButton>
      </DrawerFooter>
    </>
  );
}

export default function OpenRevertDrawer({ integrationId }) {
  const match = useRouteMatch();

  return (
    <RightDrawer
      isIntegrated
      path={drawerPaths.LCM.OPEN_REVERT}
      height="tall"
      width="xl">
      <OpenRevertDrawerContent integrationId={integrationId} parentUrl={match.url} />
    </RightDrawer>
  );
}
