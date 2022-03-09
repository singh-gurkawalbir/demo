import React from 'react';
// import { useSelector, useDispatch } from 'react-redux';
import { useHistory, useRouteMatch } from 'react-router-dom';
import RightDrawer from '../../../Right';
import DrawerHeader from '../../../Right/DrawerHeader';
import DrawerContent from '../../../Right/DrawerContent';
import DrawerFooter from '../../../Right/DrawerFooter';
import { TextButton } from '../../../../Buttons';
// import actions from '../../../../../actions';
// import { selectors } from '../../../../../reducers';

function MergePullDrawerContent({ parentUrl }) {
  // const match = useRouteMatch();
  // const { revId } = match.params;
  const history = useHistory();

  const onClose = () => {
    history.replace(parentUrl);
  };

  return (
    <>
      <DrawerHeader title="Review changes " handleClose={onClose} />
      <DrawerContent>
        <div> merge install steps </div>
      </DrawerContent>
      <DrawerFooter>
        <TextButton
          data-test="cancelCreatePull"
          onClick={onClose}>
          Cancel
        </TextButton>
      </DrawerFooter>
    </>
  );
}

export default function MergePullDrawer({ integrationId }) {
  const match = useRouteMatch();

  return (
    <RightDrawer
      path="pull/:revId/merge"
      variant="temporary"
      height="tall"
      width="xl">
      <MergePullDrawerContent integrationId={integrationId} parentUrl={match.url} />
    </RightDrawer>
  );
}
