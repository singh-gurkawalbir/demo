import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useRouteMatch } from 'react-router-dom';
import RightDrawer from '../../Right';
import DrawerHeader from '../../Right/DrawerHeader';
import DrawerContent from '../../Right/DrawerContent';
import DrawerFooter from '../../Right/DrawerFooter';
import actions from '../../../../actions';
import { selectors } from '../../../../reducers';
import useFormInitWithPermissions from '../../../../hooks/useFormInitWithPermissions';
import DynaForm from '../../../DynaForm';
import DynaSubmit from '../../../DynaForm/DynaSubmit';
import { TextButton } from '../../../Buttons';
import Spinner from '../../../Spinner';

const metadata = {
  fieldMap: {
    description: {
      id: 'description',
      name: 'description',
      type: 'text',
      label: 'Description',
      required: true,
    },
  },
};

function CreateSnapshotDrawerContent({ integrationId, parentUrl }) {
  const match = useRouteMatch();
  const { revId } = match.params;
  const history = useHistory();
  const dispatch = useDispatch();
  const formKey = useFormInitWithPermissions({ fieldMeta: metadata });

  const createdSnapshotId = useSelector(state => selectors.createdResourceId(state, revId));
  const isSnapshotCreationInProgress = useSelector(state => selectors.isRevisionCreationInProgress(state, integrationId, revId));

  const onClose = () => {
    history.replace(parentUrl);
  };

  useEffect(() => {
    if (createdSnapshotId) {
      onClose();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createdSnapshotId]);

  const handleCreateSnapshot = formValues => {
    dispatch(actions.integrationLCM.revision.createSnapshot({ integrationId, newRevisionId: revId, revisionInfo: formValues }));
  };

  return (
    <>
      <DrawerHeader title="Create snapshot" handleClose={onClose} />
      <DrawerContent>
        <DynaForm formKey={formKey} />
      </DrawerContent>
      <DrawerFooter>
        <DynaSubmit
          disabled={isSnapshotCreationInProgress}
          formKey={formKey}
          onClick={handleCreateSnapshot}
        >
          Next { isSnapshotCreationInProgress ? <Spinner size={12} /> : null }
        </DynaSubmit>
        <TextButton
          data-test="cancelCreatePull"
          disabled={isSnapshotCreationInProgress}
          onClick={onClose}>
          Cancel
        </TextButton>
      </DrawerFooter>
    </>
  );
}
export default function CreateSnapshotDrawer({ integrationId }) {
  const match = useRouteMatch();

  return (
    <RightDrawer
      path="snapshot/:revId/open"
      variant="temporary"
      height="tall"
      width="xl">
      <CreateSnapshotDrawerContent integrationId={integrationId} parentUrl={match.url} />
    </RightDrawer>
  );
}
