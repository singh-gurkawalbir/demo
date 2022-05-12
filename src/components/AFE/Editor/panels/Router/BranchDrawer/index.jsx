/* eslint-disable no-unused-vars */
import React from 'react';
import { useRouteMatch } from 'react-router-dom';
import RightDrawer from '../../../../../drawer/Right';
import LoadResources from '../../../../../LoadResources';
import DrawerContent from '../../../../../drawer/Right/DrawerContent';
import DrawerHeader from '../../../../../drawer/Right/DrawerHeader';
import DrawerFooter from '../../../../../drawer/Right/DrawerFooter';
import DynaForm from '../../../../../DynaForm';
import SaveAndCloseButtonGroupForm from '../../../../../SaveAndCloseButtonGroup/SaveAndCloseButtonGroupForm';
import useFormInitWithPermissions from '../../../../../../hooks/useFormInitWithPermissions';
import { useFormOnCancel } from '../../../../../FormOnCancelContext';

const fieldMeta = {
  fieldMap: {
    name: {
      id: 'name',
      type: 'text',
      label: 'Name',
      required: true,
    },
    description: {
      id: 'description',
      type: 'text',
      label: 'Description',
    },
  },
};

const formKey = 'branchDrawer';

export default function BranchDrawer({ flowId }) {
  const {disabled, setCancelTriggered} = useFormOnCancel(formKey);
  const match = useRouteMatch();

  useFormInitWithPermissions({ formKey, fieldMeta });

  /* TODO: We can set the drawer path to anything fi the below has match-path conflicts. */
  return (
    <RightDrawer height="tall" width="small" path="branch/edit/:position">
      <DrawerHeader
        title="Edit branch name/description"
        disableClose={disabled}
        handleClose={setCancelTriggered} />
      <LoadResources required resources="flows">
        <DrawerContent>
          <DynaForm formKey={formKey} />
        </DrawerContent>

        <DrawerFooter>
          <SaveAndCloseButtonGroupForm formKey={formKey} />
        </DrawerFooter>
      </LoadResources>
    </RightDrawer>
  );
}
