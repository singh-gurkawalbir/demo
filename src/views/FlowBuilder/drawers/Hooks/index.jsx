import React from 'react';
import HooksForm from './HooksForm';
import RightDrawer from '../../../../components/drawer/Right';
import DrawerHeader from '../../../../components/drawer/Right/DrawerHeader';

export default function HooksDrawer({ flowId }) {
  return (
    <RightDrawer path="hooks/:resourceType/:resourceId">
      <DrawerHeader
        title="Hooks"
        helpKey="export.hooks"
        helpTitle="Hooks"
      />
      <HooksForm flowId={flowId} />
    </RightDrawer>
  );
}
