import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { useDispatch, useSelector } from 'react-redux';
import { useRouteMatch, useHistory } from 'react-router-dom';
import RightDrawer from '../../../Right';
import DrawerHeader from '../../../Right/DrawerHeader';
import DrawerContent from '../../../Right/DrawerContent';
import DrawerFooter from '../../../Right/DrawerFooter';
import actions from '../../../../../actions';
import useFormInitWithPermissions from '../../../../../hooks/useFormInitWithPermissions';
import DynaForm from '../../../../DynaForm';
import DynaSubmit from '../../../../DynaForm/DynaSubmit';
import { TextButton } from '../../../../Buttons';
import {selectors } from '../../../../../reducers';
import getMetadata from './metadata';
import RevisionHeader from '../../components/RevisionHeader';
import useHandleInvalidRevision from '../../hooks/useHandleInvalidRevision';
import { buildDrawerUrl, drawerPaths } from '../../../../../utils/rightDrawer';

const useStyles = makeStyles(() => ({
  drawerHeader: {
    '& > h4': {
      whiteSpace: 'nowrap',
    },
  },
}));

function OpenRevertDrawerContent({ integrationId, parentUrl }) {
  const match = useRouteMatch();
  const classes = useStyles();
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
      <DrawerHeader
        className={classes.drawerHeader}
        helpKey="revert.create"
        title="Create revert"
        handleClose={onClose}>
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
      path={drawerPaths.LCM.OPEN_REVERT}
      height="tall"
      width="xl">
      <OpenRevertDrawerContent integrationId={integrationId} parentUrl={match.url} />
    </RightDrawer>
  );
}
