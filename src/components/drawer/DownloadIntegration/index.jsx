import React from 'react';
import GenerateZip from '../../GenerateZip';
import RightDrawer from '../Right/V2';
import DrawerHeader from '../Right/V2/DrawerHeader';
import DrawerContent from '../Right/V2/DrawerContent';

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
