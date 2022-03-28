import React from 'react';
import HooksForm from './HooksForm';
import RightDrawer from '../../../../components/drawer/Right';
import DrawerHeader from '../../../../components/drawer/Right/DrawerHeader';
import EditorDrawer from '../../../../components/AFE/Drawer';
import ResourceDrawer from '../../../../components/drawer/Resource';
import { useFormOnCancel } from '../../../../components/FormOnCancelContext';
import { DRAWER_URLS } from '../../../../utils/drawerURLs';

const formKey = 'hooksave';
export default function HooksDrawer({ flowId, integrationId }) {
  const {setCancelTriggered, disabled} = useFormOnCancel(formKey);

  return (
    <RightDrawer path={DRAWER_URLS.FLOW_BUILDER_HOOKS}>
      <DrawerHeader
        title="Hooks"
        helpKey="export.hooks"
        helpTitle="Hooks"
        disableClose={disabled}
        handleClose={setCancelTriggered}
      />
      <HooksForm flowId={flowId} integrationId={integrationId} formKey={formKey} />
      <EditorDrawer />
      <ResourceDrawer />
    </RightDrawer>
  );
}
