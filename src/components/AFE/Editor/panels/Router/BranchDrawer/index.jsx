import React from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import RightDrawer from '../../../../../drawer/Right';
import LoadResources from '../../../../../LoadResources';
import DrawerContent from '../../../../../drawer/Right/DrawerContent';
import DrawerHeader from '../../../../../drawer/Right/DrawerHeader';
import DrawerFooter from '../../../../../drawer/Right/DrawerFooter';
import DynaForm from '../../../../../DynaForm';
import SaveAndCloseButtonGroupForm from '../../../../../SaveAndCloseButtonGroup/SaveAndCloseButtonGroupForm';
import useFormInitWithPermissions from '../../../../../../hooks/useFormInitWithPermissions';
import { useFormOnCancel } from '../../../../../FormOnCancelContext';
import { drawerPaths } from '../../../../../../utils/rightDrawer';

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

// const formKey = 'branchDrawer';

export default function BranchDrawer({ editorId }) {
  const formKey = useFormInitWithPermissions({ fieldMeta });
  const {disabled, setCancelTriggered} = useFormOnCancel(formKey);
  const match = useRouteMatch();
  const history = useHistory();
  const position = match?.params?.position;

  const handleSave = values => {
    console.log(editorId, position, values);
  };
  const handleClose = history.goBack();

  /* TODO: We can set the drawer path to anything if the below
     has match-path conflicts, or not providing the proper datum. */
  return (
    <RightDrawer height="tall" width="small" path={drawerPaths.FLOW_BUILDER.BRANCH_EDIT}>
      <DrawerHeader
        title="Edit branch name/description"
        disableClose={disabled}
        handleClose={setCancelTriggered} />
      <LoadResources required resources="flows">
        <DrawerContent>
          <DynaForm formKey={formKey} />
        </DrawerContent>

        <DrawerFooter>
          <SaveAndCloseButtonGroupForm
            onClose={handleClose}
            onSave={handleSave}
            formKey={formKey} />
        </DrawerFooter>
      </LoadResources>
    </RightDrawer>
  );
}
