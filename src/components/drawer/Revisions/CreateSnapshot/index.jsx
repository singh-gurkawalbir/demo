import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
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
import RevisionHeader from '../components/RevisionHeader';
import { DRAWER_URLS } from '../../../../utils/drawerURLs';

const useStyles = makeStyles(theme => ({
  drawerHeader: {
    '& > h4': {
      whiteSpace: 'nowrap',
    },
  },
  inProgressSpinner: {
    marginRight: theme.spacing(0.5),
    height: theme.spacing(2),
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
  const formKey = useFormInitWithPermissions({ fieldMeta: metadata });

  const { revId } = match.params;

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
      <DrawerHeader
        className={classes.drawerHeader}
        helpKey="snapshot.create"
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
          { isSnapshotCreationInProgress ? <><Spinner size="small" className={classes.inProgressSpinner} /> Creating</> : 'Create' }
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
      path={DRAWER_URLS.CREATE_SNAPSHOT}
      variant="temporary"
      height="tall"
      width="xl">
      <CreateSnapshotDrawerContent integrationId={integrationId} parentUrl={match.url} />
    </RightDrawer>
  );
}
