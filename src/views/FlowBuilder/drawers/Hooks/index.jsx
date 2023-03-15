import React from 'react';
import HooksForm from './HooksForm';
import RightDrawer from '../../../../components/drawer/Right';
import DrawerHeader from '../../../../components/drawer/Right/DrawerHeader';
import EditorDrawer from '../../../../components/AFE/Drawer';
import ResourceDrawer from '../../../../components/drawer/Resource';
import { useFormOnCancel } from '../../../../components/FormOnCancelContext';
import { drawerPaths } from '../../../../utils/rightDrawer';

const formKey = 'hooksave';
export default function HooksDrawer({ flowId, integrationId }) {
  const {setCancelTriggered, disabled} = useFormOnCancel(formKey);

  return (
    <RightDrawer path={drawerPaths.FLOW_BUILDER.HOOKS}>
      <DrawerHeader
        title="Hooks"
        helpKey="export.hooks"
        helpTitle="Hooks"
        disableClose={disabled}
        contentId="exportHooks"
        handleClose={setCancelTriggered} />
      <HooksForm flowId={flowId} integrationId={integrationId} formKey={formKey} />
      <EditorDrawer />
      <ResourceDrawer />
    </RightDrawer>
  );
}
