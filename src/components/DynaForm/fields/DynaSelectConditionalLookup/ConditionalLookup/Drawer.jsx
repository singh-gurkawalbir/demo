import React from 'react';
import { useHistory } from 'react-router-dom';
import ConditionalLookup from '.';
import RightDrawer from '../../../../drawer/Right';
import DrawerHeader from '../../../../drawer/Right/DrawerHeader';
import DrawerContent from '../../../../drawer/Right/DrawerContent';

export default function ConditionalLookupDrawer(props) {
  const history = useHistory();
  const isEdit = history.location.pathname.includes('/edit');

  return (
    <RightDrawer
      path={['conditionalLookup/edit/:lookupName', 'conditionalLookup/add']}
      height="tall"
      width="default"
      variant="temporary"
      >
      <DrawerHeader title={`${isEdit ? 'Edit' : 'Add'} Lookup`} />
      <DrawerContent>
        <ConditionalLookup {...props} />
      </DrawerContent>
    </RightDrawer>
  );
}
