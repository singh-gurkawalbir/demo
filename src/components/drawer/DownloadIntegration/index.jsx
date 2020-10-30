import React from 'react';
import GenerateZip from '../../GenerateZip';
import RightDrawer from '../Right';
import DrawerHeader from '../Right/DrawerHeader';
import DrawerContent from '../Right/DrawerContent';

export default function DownloadIntegrationDrawer() {
  return (
    <RightDrawer
      path="downloadIntegration"
      height="tall">

      <DrawerHeader title="Download integration" />

      <DrawerContent>
        <GenerateZip />
      </DrawerContent>

    </RightDrawer>
  );
}
