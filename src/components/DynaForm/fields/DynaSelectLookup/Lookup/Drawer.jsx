import React from 'react';
import { useHistory } from 'react-router-dom';
import Lookup from '.';
import RightDrawer from '../../../../drawer/Right';
import DrawerHeader from '../../../../drawer/Right/DrawerHeader';
import { drawerPaths } from '../../../../../utils/rightDrawer';
import useFormOnCancelContext from '../../../../FormOnCancelContext';
import { LOOKUP_FORM_KEY } from '../../../../../utils/constants';

export default function LookupDrawer(props) {
  const history = useHistory();
  // TODO @Raghu: We can have a Title component instead of parent component deciding the title
  const isEdit = history.location.pathname.includes('/lookups/edit');

  // onClose prop provided to RightDrawer for functioning 'CloseIcon'
  const {setCancelTriggered} = useFormOnCancelContext(LOOKUP_FORM_KEY);

  return (
    <RightDrawer
      path={[drawerPaths.LOOKUPS.ADD, drawerPaths.LOOKUPS.EDIT]}
      height="tall"
      width="default"
      onClose={setCancelTriggered}>
      <DrawerHeader title={`${isEdit ? 'Edit' : 'Create'} lookup`} />
      <Lookup {...props} />
    </RightDrawer>
  );
}
