import React from 'react';
import { useSelector } from 'react-redux';
import HooksForm from './HooksForm';
import RightDrawer from '../../../../components/drawer/Right';
import DrawerHeader from '../../../../components/drawer/Right/DrawerHeader';
import EditorDrawer from '../../../../components/AFE/Drawer';
import { selectors } from '../../../../reducers';
import { FORM_SAVE_STATUS } from '../../../../utils/constants';

const formKey = 'hooksave';
export default function HooksDrawer({ flowId, integrationId }) {
  const status = useSelector(state =>
    selectors.asyncTaskStatus(state, formKey));

  const disabled = status === FORM_SAVE_STATUS.LOADING;

  return (
    <RightDrawer path="hooks/:resourceType/:resourceId">
      <DrawerHeader
        title="Hooks"
        helpKey="export.hooks"
        helpTitle="Hooks"
        disableClose={disabled}
      />
      <HooksForm flowId={flowId} integrationId={integrationId} formKey={formKey} />
      <EditorDrawer />
    </RightDrawer>
  );
}
