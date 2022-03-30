import React from 'react';
import { useDispatch } from 'react-redux';
import {makeStyles} from '@material-ui/core/styles';
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
import RevisionHeader from '../../components/RevisionHeader';
import { DRAWER_URLS, DRAWER_URL_PREFIX } from '../../../../../utils/drawerURLs';

const useStyles = makeStyles(() => ({
  drawerHeader: {
    '& > h4': {
      whiteSpace: 'nowrap',
    },
  },
}));

function OpenPullDrawerContent({ integrationId, parentUrl }) {
  const match = useRouteMatch();
  const classes = useStyles();
  const { revId } = match.params;
  const history = useHistory();
  const dispatch = useDispatch();
  const formKey = useFormInitWithPermissions({ fieldMeta: getMetadata({integrationId}) });
  const onClose = () => {
    history.replace(parentUrl);
  };

  const handleCreateRevision = formValues => {
    const revisionInfo = {
      description: formValues.description,
      integration: formValues.integration.value,
    };

    dispatch(actions.integrationLCM.revision.openPull({ integrationId, newRevisionId: revId, revisionInfo }));
    history.replace(`${parentUrl}/${DRAWER_URL_PREFIX}/pull/${revId}/review`);
  };

  return (
    <>
      <DrawerHeader title="Create pull" helpKey="revisions.pull" className={classes.drawerHeader} handleClose={onClose}>
        <RevisionHeader />
      </DrawerHeader>
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
      path={DRAWER_URLS.OPEN_PULL}
      height="tall"
      width="xl">
      <OpenPullDrawerContent integrationId={integrationId} parentUrl={match.url} />
    </RightDrawer>
  );
}
