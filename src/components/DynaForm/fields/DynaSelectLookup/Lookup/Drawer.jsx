import React from 'react';
import { useHistory } from 'react-router-dom';
import Lookup from '.';
import RightDrawer from '../../../../drawer/Right';
import DrawerHeader from '../../../../drawer/Right/DrawerHeader';
import DrawerContent from '../../../../drawer/Right/DrawerContent';

export default function LookupDrawer(props) {
  const history = useHistory();
  const isEdit = history.location.pathname.includes('/lookup/edit');

  return (
    <RightDrawer
      path={['lookup/edit/:lookupName', 'lookup/add']}
      height="tall"
      width="default"
      variant="temporary"
      >
      <DrawerHeader title={`${isEdit ? 'Edit' : 'Add'} Lookup`} />
      <DrawerContent>
        <Lookup {...props} />
      </DrawerContent>
    </RightDrawer>
  );
}
