import React from 'react';
import LoadResources from '../LoadResources';
import RightDrawer from '../drawer/Right';
import DrawerHeader from '../drawer/Right/DrawerHeader';
import DrawerContent from '../drawer/Right/DrawerContent';
import ResponseMappingWrapper from '.';

export default function ResponseMappingDrawer() {
  return (
  // TODO (Aditya/Raghu): Break it into 2 side drawer after changes to RightDrawer is done on exact property.
  // Also check for dummy route implementation on Right Drawer
    <LoadResources
      required="true"
      resources="imports, exports, connections">
      <RightDrawer
        path={[
          'responseMapping/:flowId/:resourceId',
        ]}
        height="tall"
        width="full"
        variant="persistent"
        >
        <DrawerHeader title="Edit Response mapping" />
        <DrawerContent>
          <ResponseMappingWrapper />
        </DrawerContent>
      </RightDrawer>
    </LoadResources>
  );
}
