import React from 'react';
import HooksForm from './HooksForm';
import RightDrawer from '../../../../components/drawer/Right';
import DrawerHeader from '../../../../components/drawer/Right/DrawerHeader';
import EditorDrawer from '../../../../components/AFE/Drawer';
import { useFormOnCancel } from '../../../../components/FormOnCancelContext';

const formKey = 'hooksave';
export default function HooksDrawer({ flowId, integrationId }) {
  const {setCancelTriggered, disabled} = useFormOnCancel(formKey);

  return (
    <RightDrawer path="hooks/:resourceType/:resourceId">
      <DrawerHeader
        title="Hooks"
        helpKey="export.hooks"
        helpTitle="Hooks"
        disableClose={disabled}
        handleClose={setCancelTriggered}
      />
      <HooksForm flowId={flowId} integrationId={integrationId} formKey={formKey} />
      <EditorDrawer />
    </RightDrawer>
  );
}
