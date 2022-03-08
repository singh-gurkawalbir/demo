import React from 'react';
// import { useHistory, useRouteMatch } from 'react-router-dom';
import RightDrawer from '../../../Right';
import DrawerHeader from '../../../Right/DrawerHeader';
import DrawerContent from '../../../Right/DrawerContent';
import DrawerFooter from '../../../Right/DrawerFooter';
// import { selectors} from '../../../../../reducers';
// import actions from '../../../../../actions';
import useFormInitWithPermissions from '../../../../../hooks/useFormInitWithPermissions';
import DynaForm from '../../../../DynaForm';
import DynaSubmit from '../../../../DynaForm/DynaSubmit';
import { TextButton } from '../../../../Buttons';
import getMetadata from './metadata';

function OpenPullDrawerContent({ integrationId }) {
  // const match = useRouteMatch();
  // const { revId } = match.params;
  // const history = useHistory();
  const formKey = useFormInitWithPermissions({ fieldMeta: getMetadata({integrationId}) });
  const onClose = () => {};

  const handleCreateRevision = formValues => {
    const { description, integration } = formValues;

    console.log(description, integration);
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
  return (
    <RightDrawer
      path="pull/:revId/open"
      variant="temporary"
      height="tall"
      width="xl">
      <OpenPullDrawerContent integrationId={integrationId} />
    </RightDrawer>
  );
}
