import React from 'react';
import { useHistory } from 'react-router-dom';
import Lookup from '.';
import RightDrawer from '../../../../drawer/Right';
import DrawerHeader from '../../../../drawer/Right/DrawerHeader';

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
      <Lookup {...props} />
    </RightDrawer>
  );
}
