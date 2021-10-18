import React, {useCallback, useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import actions from '../../../actions';
import { selectors } from '../../../reducers';
import RightDrawer from '../Right';
import LoadResources from '../../LoadResources';
import DrawerContent from '../Right/DrawerContent';
import DrawerHeader from '../Right/DrawerHeader';
import DrawerFooter from '../Right/DrawerFooter';
import DynaForm from '../../DynaForm';
import SaveAndCloseButtonGroupForm from '../../SaveAndCloseButtonGroup/SaveAndCloseButtonGroupForm';
import useFormInitWithPermissions from '../../../hooks/useFormInitWithPermissions';
import { useFormOnCancel } from '../../FormOnCancelContext';
import { useSelectorMemo } from '../../../hooks';

const formKey = 'flow-flowgroup';
const paths = ['flowgroups/add', 'flowgroups/edit'];

const getFieldMeta = integrationId => ({
  fieldMap: {
    integration: {
      id: 'integration',
      type: 'text',
      defaultValue: integrationId,
      visible: false,
    },
    name: {
      id: 'name',
      type: 'text',
      label: 'Name',
      required: true,
    },
    _flowIds: {
      id: '_flowIds',
      type: 'flowstiedtointegrations',
      helpText: 'something',
      label: 'Flows',
      placeholder: 'Choose flows',
      required: true,
      defaultValue: [],
    },
  },
});

function FlowgroupForm({ integrationId }) {
  const history = useHistory();
  const dispatch = useDispatch();
  const [remountCount, setRemountCount] = useState(0);
  const handleClose = history.goBack;
  const integration = useSelectorMemo(selectors.makeResourceSelector, 'integrations', integrationId);
  const values = useSelector(state => selectors.formState(state, formKey)?.fields);
  const handleSave = useCallback(() => {
    const { name, _flowIds } = values;

    dispatch(actions.resource.integrations.flowGroups.createOrUpdate(integration, name.value, _flowIds.value));
  }, [dispatch, integration, values]);

  const fieldMeta = getFieldMeta(integrationId);
  const remountForm = useCallback(() => {
    setRemountCount(remountCount => remountCount + 1);
  }, []);

  useFormInitWithPermissions({formKey, fieldMeta, remount: remountCount});

  return (
    <LoadResources required resources="flows">
      <DrawerContent>
        <DynaForm formKey={formKey} />
      </DrawerContent>

      <DrawerFooter>
        <SaveAndCloseButtonGroupForm
          formKey={formKey}
          onSave={handleSave}
          onClose={handleClose}
          remountAfterSaveFn={remountForm}
          />
      </DrawerFooter>
    </LoadResources>
  );
}
export default function FlowgroupDrawer({ integrationId }) {
  const {disabled, setCancelTriggered} = useFormOnCancel(formKey);

  return (
    <RightDrawer
      height="tall"
      width="medium"
      path={paths}
    >
      <DrawerHeader
        title="Create flow group"
        disableClose={disabled}
        handleClose={setCancelTriggered} />
      <FlowgroupForm integrationId={integrationId} />
    </RightDrawer>
  );
}
