import React from 'react';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { selectors } from '../../../../../../reducers';
import RightDrawer from '../../../../../drawer/Right';
import DrawerContent from '../../../../../drawer/Right/DrawerContent';
import DrawerHeader from '../../../../../drawer/Right/DrawerHeader';
import DrawerFooter from '../../../../../drawer/Right/DrawerFooter';
import DynaForm from '../../../../../DynaForm';
import SaveAndCloseButtonGroupForm from '../../../../../SaveAndCloseButtonGroup/SaveAndCloseButtonGroupForm';
import useFormInitWithPermissions from '../../../../../../hooks/useFormInitWithPermissions';
import { drawerPaths } from '../../../../../../utils/rightDrawer';
import actions from '../../../../../../actions';

const getFieldMeta = branch => ({
  fieldMap: {
    name: {
      name: 'name',
      id: 'name',
      type: 'text',
      label: 'Name',
      required: true,
      defaultValue: branch.name,
    },
    description: {
      name: 'description',
      id: 'description',
      type: 'text',
      label: 'Description',
      defaultValue: branch.description,
    },
  },
});

function RouterWrappedContent({editorId}) {
  const { position } = useParams();
  const history = useHistory();
  const branch = useSelector(state => selectors.editorRule(state, editorId)?.branches?.[position]);
  const fieldMeta = getFieldMeta(branch);
  const formKey = useFormInitWithPermissions({ fieldMeta });
  const dispatch = useDispatch();
  // This is strange to query the form values like this.
  // Why doesn't the <SaveAndCloseButtonGroupForm> onSave event pass the form values?
  const values = useSelector(state => selectors.formValueTrimmed(state, formKey), shallowEqual);

  const handleClose = history.goBack;

  const handleSave = closeAfterSave => {
    dispatch(actions.editor.patchRule(editorId, {...branch, ...values}, {rulePath: `branches[${position}]`}));

    if (closeAfterSave) handleClose();
  };

  return (
    <>
      <DrawerHeader
        title="Edit branch name/description"
        handleClose={handleClose} />

      <DrawerContent>
        <DynaForm formKey={formKey} />
      </DrawerContent>

      <DrawerFooter>
        <SaveAndCloseButtonGroupForm
          onClose={handleClose}
          onSave={handleSave}
          formKey={formKey}
        />
      </DrawerFooter>
    </>
  );
}

export default function BranchDrawer({ editorId }) {
  return (
    <RightDrawer height="tall" width="small" path={drawerPaths.FLOW_BUILDER.BRANCH_EDIT}>
      <RouterWrappedContent editorId={editorId} />
    </RightDrawer>
  );
}
