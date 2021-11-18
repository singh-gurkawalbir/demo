import React, { useCallback, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useRouteMatch } from 'react-router-dom';
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
import useEnqueueSnackbar from '../../../hooks/enqueueSnackbar';

const FLOW_GROUP_FORM_KEY = 'flow-flowgroup';
const paths = ['flowgroups/add', 'flowgroups/edit'];

const getFieldMeta = (integrationId, groupName, flowsWithGroupId, isEdit) => ({
  fieldMap: {
    name: {
      id: 'name',
      type: 'flowgroupname',
      label: 'Name',
      integrationId,
      defaultValue: groupName,
      flows: flowsWithGroupId,
      isEdit,
      required: true,
    },
    _flowIds: {
      id: '_flowIds',
      type: 'flowstiedtointegrations',
      label: 'Flows',
      placeholder: 'Add flows',
      defaultValue: flowsWithGroupId.map(flow => flow._id),
      unSearchable: true,
      isFlowGroupForm: true,
      integrationId,
    },
  },
});

function FlowgroupForm({ integrationId, groupId, isEdit }) {
  const history = useHistory();
  const dispatch = useDispatch();
  const [enquesnackbar] = useEnqueueSnackbar();
  const [remountCount, setRemountCount] = useState(0);
  const handleClose = history.goBack;
  const integration = useSelectorMemo(selectors.makeResourceSelector, 'integrations', integrationId);
  const flowsTiedToIntegrations = useSelectorMemo(selectors.mkAllFlowsTiedToIntegrations, integrationId, []);
  let groupName;
  let flowGroupId;
  let flowsWithGroupId = [];

  if (isEdit) {
    groupName = integration.flowGroupings.find(group => group._id === groupId)?.name;
    flowGroupId = groupId;
    flowsWithGroupId = flowsTiedToIntegrations.filter(flow => flow._flowGroupingId === groupId);
  }
  const formValues = useSelector(state => selectors.formState(state, FLOW_GROUP_FORM_KEY)?.fields);
  const fieldMeta = getFieldMeta(integrationId, groupName, flowsWithGroupId, isEdit);
  const { status: flowGroupSaveStatus, message } = useSelector(state => selectors.flowGroupStatus(state, integrationId)) || {};

  useFormInitWithPermissions({FLOW_GROUP_FORM_KEY, fieldMeta, remount: remountCount});

  useEffect(() => {
    if (flowGroupSaveStatus === 'Failed') {
      enquesnackbar({ message: message || 'Flow goup failed to save' });
    }
  }, [enquesnackbar, flowGroupSaveStatus, message]);
  const handleSave = useCallback(closeAfterSave => {
    const { name, _flowIds } = formValues;
    const deSelectedFlows = flowsWithGroupId.filter(flow => !_flowIds.value.find(id => id === flow._id));

    dispatch(actions.resource.integrations.flowGroups.createOrUpdate(integrationId, name.value, flowGroupId, _flowIds.value, deSelectedFlows, FLOW_GROUP_FORM_KEY));
    if (closeAfterSave) {
      handleClose();
    }
  }, [formValues, flowsWithGroupId, dispatch, integrationId, flowGroupId, handleClose]);
  const remountForm = useCallback(() => {
    setRemountCount(remountCount => remountCount + 1);
  }, []);

  return (
    <LoadResources required resources="flows">
      <DrawerContent>
        <DynaForm formKey={FLOW_GROUP_FORM_KEY} />
      </DrawerContent>

      <DrawerFooter>
        <SaveAndCloseButtonGroupForm
          formKey={FLOW_GROUP_FORM_KEY}
          onSave={handleSave}
          onClose={handleClose}
          remountAfterSaveFn={remountForm}
        />
      </DrawerFooter>
    </LoadResources>
  );
}
export default function FlowgroupDrawer({ integrationId }) {
  const {disabled, setCancelTriggered} = useFormOnCancel(FLOW_GROUP_FORM_KEY);
  const history = useHistory();
  const isEdit = history.location.pathname.includes('/edit');
  const match = useRouteMatch();
  const groupId = match?.params?.sectionId || '';

  return (
    <RightDrawer
      height="tall"
      width="medium"
      path={paths}
    >
      <DrawerHeader
        title={`${isEdit ? 'Edit' : 'Create'} flow group`}
        disableClose={disabled}
        handleClose={setCancelTriggered} />
      <FlowgroupForm integrationId={integrationId} groupId={groupId} isEdit={isEdit} />
    </RightDrawer>
  );
}
