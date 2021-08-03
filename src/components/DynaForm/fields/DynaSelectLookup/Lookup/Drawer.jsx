import React from 'react';
import { useHistory } from 'react-router-dom';
import Lookup from '.';
import RightDrawer from '../../../../drawer/Right';
import DrawerHeader from '../../../../drawer/Right/DrawerHeader';
import DrawerContent from '../../../../drawer/Right/DrawerContent';

export default function LookupDrawer(props) {
  const history = useHistory();
  const isEdit = history.location.pathname.includes('/lookups/edit');

  return (
    <RightDrawer
      path={['lookups/edit/:lookupName', 'lookups/add']}
      height="tall"
      width="default"
      variant="persistent"
      >
      <DrawerHeader title={`${isEdit ? 'Edit' : 'Create'} lookup`} />
      <DrawerContent>
        <Lookup {...props} />
      </DrawerContent>
    </RightDrawer>
  );
}
