import React from 'react';
import { useRouteMatch } from 'react-router-dom';
import ConditionalLookup from '.';
import RightDrawer from '../../../../drawer/Right';
import DrawerHeader from '../../../../drawer/Right/DrawerHeader';
import DrawerContent from '../../../../drawer/Right/DrawerContent';
import { DRAWER_URLS } from '../../../../../utils/drawerURLs';

function ConditionalLookupDrawerHeader() {
  const match = useRouteMatch();
  const {lookupName} = match.params;

  return <DrawerHeader title={`${lookupName ? 'Edit' : 'Add'} Lookup`} />;
}

export default function ConditionalLookupDrawer(props) {
  return (
    <RightDrawer
      path={DRAWER_URLS.CONDITIONAL_LOOKUP}
      height="tall"
      width="default">
      <ConditionalLookupDrawerHeader />
      <DrawerContent>
        <ConditionalLookup {...props} />
      </DrawerContent>
    </RightDrawer>
  );
}
