import React from 'react';
import { useRouteMatch } from 'react-router-dom';
import ConditionalLookup from '.';
import RightDrawer from '../../../../drawer/Right';
import DrawerHeader from '../../../../drawer/Right/DrawerHeader';
import DrawerContent from '../../../../drawer/Right/DrawerContent';

function ConditionalLookupDrawerHeader() {
  const match = useRouteMatch();
  const {lookupName} = match.params;

  return <DrawerHeader title={`${lookupName ? 'Edit' : 'Add'} Lookup`} />;
}

export default function ConditionalLookupDrawer(props) {
  return (
    <RightDrawer
      path={['conditionalLookup/edit/:lookupName', 'conditionalLookup/add']}
      height="tall"
      width="default"
      variant="temporary"
      >
      <ConditionalLookupDrawerHeader />
      <DrawerContent>
        <ConditionalLookup {...props} />
      </DrawerContent>
    </RightDrawer>
  );
}
