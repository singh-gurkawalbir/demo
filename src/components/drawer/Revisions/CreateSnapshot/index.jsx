import React, { useEffect } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { Spinner } from '@celigo/fuse-ui';
import RightDrawer from '../../Right';
import DrawerHeader from '../../Right/DrawerHeader';
import DrawerContent from '../../Right/DrawerContent';
import DrawerFooter from '../../Right/DrawerFooter';
import actions from '../../../../actions';
import { selectors } from '../../../../reducers';
import { message } from '../../../../utils/messageStore';
import useFormInitWithPermissions from '../../../../hooks/useFormInitWithPermissions';
import DynaForm from '../../../DynaForm';
import DynaSubmit from '../../../DynaForm/DynaSubmit';
import { TextButton } from '../../../Buttons';
import RevisionHeader from '../components/RevisionHeader';
import { drawerPaths } from '../../../../utils/rightDrawer';
import useEnqueueSnackbar from '../../../../hooks/enqueueSnackbar';

const useStyles = makeStyles(() => ({
  drawerHeader: {
    '& > h4': {
      whiteSpace: 'nowrap',
    },
  },
}));

const metadata = {
  fieldMap: {
    description: {
      id: 'description',
      name: 'description',
      helpKey: 'snapshot.description',
      type: 'text',
      noApi: true,
      label: 'Description',
      required: true,
    },
  },
};

function CreateSnapshotDrawerContent({ integrationId, parentUrl }) {
  const classes = useStyles();
  const match = useRouteMatch();
  const history = useHistory();
  const dispatch = useDispatch();
  const [enqueueSnackbar] = useEnqueueSnackbar();
  const formKey = useFormInitWithPermissions({ fieldMeta: metadata });

  const { revId } = match.params;

  const createdSnapshotId = useSelector(state => selectors.createdResourceId(state, revId));
  const isSnapshotCreationInProgress = useSelector(state => selectors.isRevisionCreationInProgress(state, integrationId, revId));

  const onClose = () => {
    history.replace(parentUrl);
  };

  useEffect(() => {
    if (createdSnapshotId) {
      enqueueSnackbar({ message: message.LCM.SNAPSHOT_SUCCESS });
      onClose();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createdSnapshotId]);

  const handleCreateSnapshot = formValues => {
    dispatch(actions.integrationLCM.revision.createSnapshot({ integrationId, newRevisionId: revId, revisionInfo: formValues }));
  };

  return (
    <>
      <DrawerHeader
        className={classes.drawerHeader}
        infoText={message.LCM.CREATE_SNAPSHOT_FORM_HELPINFO}
        title="Create snapshot"
        handleClose={onClose}>
        <RevisionHeader />
      </DrawerHeader>
      <DrawerContent>
        <DynaForm formKey={formKey} />
      </DrawerContent>
      <DrawerFooter>
        <DynaSubmit
          disabled={isSnapshotCreationInProgress}
          formKey={formKey}
          onClick={handleCreateSnapshot}
        >
          { isSnapshotCreationInProgress ? (
            <><Spinner
              size="small" sx={{
                mr: 0.5,
                height: 16,
              }} /> Creating
            </>
          ) : 'Create' }
        </DynaSubmit>
        <TextButton
          data-test="cancelSnapshot"
          disabled={isSnapshotCreationInProgress}
          onClick={onClose}>
          Close
        </TextButton>
      </DrawerFooter>
    </>
  );
}
export default function CreateSnapshotDrawer({ integrationId }) {
  const match = useRouteMatch();

  return (
    <RightDrawer
      path={drawerPaths.LCM.CREATE_SNAPSHOT}
      height="tall"
      width="medium">
      <CreateSnapshotDrawerContent integrationId={integrationId} parentUrl={match.url} />
    </RightDrawer>
  );
}
