import React from 'react';
import { useDispatch } from 'react-redux';
import { useHistory, useRouteMatch } from 'react-router-dom';
import RightDrawer from '../../../Right';
import DrawerHeader from '../../../Right/DrawerHeader';
import DrawerContent from '../../../Right/DrawerContent';
import DrawerFooter from '../../../Right/DrawerFooter';
import actions from '../../../../../actions';
import useFormInitWithPermissions from '../../../../../hooks/useFormInitWithPermissions';
import DynaForm from '../../../../DynaForm';
import DynaSubmit from '../../../../DynaForm/DynaSubmit';
import { TextButton } from '../../../../Buttons';
import getMetadata from './metadata';

function OpenPullDrawerContent({ integrationId, parentUrl }) {
  const match = useRouteMatch();
  const { revId } = match.params;
  const history = useHistory();
  const dispatch = useDispatch();
  const formKey = useFormInitWithPermissions({ fieldMeta: getMetadata({integrationId}) });
  const onClose = () => {
    history.replace(parentUrl);
  };

  const handleCreateRevision = formValues => {
    dispatch(actions.integrationLCM.revision.openPull({ integrationId, newRevisionId: revId, revisionInfo: formValues }));
    history.replace(`${parentUrl}/pull/${revId}/review`);
  };

  return (
    <>
      <DrawerHeader title="Create pull" handleClose={onClose} />
      <DrawerContent>
        <DynaForm formKey={formKey} />
      </DrawerContent>
      <DrawerFooter>
        <DynaSubmit formKey={formKey} onClick={handleCreateRevision} >
          Next
        </DynaSubmit>
        <TextButton
          data-test="cancelCreatePull"
          onClick={onClose}>
          Cancel
        </TextButton>
      </DrawerFooter>
    </>
  );
}

export default function OpenPullDrawer({ integrationId }) {
  const match = useRouteMatch();

  return (
    <RightDrawer
      path="pull/:revId/open"
      variant="temporary"
      height="tall"
      width="xl">
      <OpenPullDrawerContent integrationId={integrationId} parentUrl={match.url} />
    </RightDrawer>
  );
}
