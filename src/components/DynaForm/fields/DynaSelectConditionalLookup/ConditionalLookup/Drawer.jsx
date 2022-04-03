import React from 'react';
import { useRouteMatch } from 'react-router-dom';
import ConditionalLookup from '.';
import RightDrawer from '../../../../drawer/Right';
import DrawerHeader from '../../../../drawer/Right/DrawerHeader';
import DrawerContent from '../../../../drawer/Right/DrawerContent';
import { drawerPaths } from '../../../../../utils/rightDrawer';

function ConditionalLookupDrawerHeader() {
  const match = useRouteMatch();
  const {lookupName} = match.params;

  return <DrawerHeader title={`${lookupName ? 'Edit' : 'Add'} Lookup`} />;
}

export default function ConditionalLookupDrawer(props) {
  return (
    <RightDrawer
      path={[drawerPaths.MAPPINGS.CONDITIONAL_LOOKUP.EDIT, drawerPaths.MAPPINGS.CONDITIONAL_LOOKUP.ADD]}
      height="tall"
      width="default">
      <ConditionalLookupDrawerHeader />
      <DrawerContent>
        <ConditionalLookup {...props} />
      </DrawerContent>
    </RightDrawer>
  );
}
