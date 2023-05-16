import React, { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useRouteMatch } from 'react-router-dom';
import {
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  InfoIconButton,
} from '@celigo/fuse-ui';
import RightDrawer from '../../../Right';
import actions from '../../../../../actions';
import { selectors } from '../../../../../reducers';
import useFormInitWithPermissions from '../../../../../hooks/useFormInitWithPermissions';
import DynaForm from '../../../../DynaForm';
import DynaSubmit from '../../../../DynaForm/DynaSubmit';
import { TextButton } from '../../../../Buttons';
import getMetadata from './metadata';
import RevisionHeader from '../../components/RevisionHeader';
import { drawerPaths, buildDrawerUrl } from '../../../../../utils/rightDrawer';
import ErrorContent from '../../../../ErrorContent';
import { message } from '../../../../../utils/messageStore';
import useEnqueueSnackbar from '../../../../../hooks/enqueueSnackbar';

function OpenPullDrawerContent({ integrationId, parentUrl }) {
  const match = useRouteMatch();
  const history = useHistory();
  const dispatch = useDispatch();
  const [enquesnackbar] = useEnqueueSnackbar();
  const { revId } = match.params;

  const hasNoCloneFamily = useSelector(state => selectors.hasNoCloneFamily(state, integrationId));
  const formKey = useFormInitWithPermissions({ fieldMeta: getMetadata({integrationId}) });

  const onClose = useCallback(
    () => {
      history.replace(parentUrl);
    },
    [history, parentUrl],
  );

  const handleCreateRevision = formValues => {
    const revisionInfo = {
      description: formValues.description,
      integration: formValues.integration.value,
    };

    dispatch(actions.integrationLCM.revision.openPull({ integrationId, newRevisionId: revId, revisionInfo }));
    history.replace(buildDrawerUrl({
      path: drawerPaths.LCM.REVIEW_PULL_CHANGES,
      baseUrl: parentUrl,
      params: { revisionId: revId },
    }));
  };

  useEffect(() => {
    if (hasNoCloneFamily) {
      // when user directly lands on open pull drawer and
      // If the integration does not have any clones to pull from
      // then close the drawer and show the error message to the user
      onClose();

      enquesnackbar({
        message: <ErrorContent error={message.LCM.NO_CLONE_FAMILY_TO_PULL_FROM_ERROR} />,
        variant: 'error',
      });
    }
  }, [hasNoCloneFamily, enquesnackbar, onClose]);

  return (
    <>
      <DrawerHeader sx={{ whiteSpace: 'nowrap' }}>
        <DrawerTitle>
          Create pull
          <InfoIconButton title="Create pull" info={message.LCM.CREATE_PULL_FORM_HELPINFO} />
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
          data-test="cancelCreatePull"
          onClick={onClose}>
          Close
        </TextButton>
      </DrawerFooter>
    </>
  );
}

export default function OpenPullDrawer({ integrationId }) {
  const match = useRouteMatch();

  return (
    <RightDrawer
      isIntegrated
      path={drawerPaths.LCM.OPEN_PULL}
      height="tall"
      width="xl">
      <OpenPullDrawerContent integrationId={integrationId} parentUrl={match.url} />
    </RightDrawer>
  );
}
