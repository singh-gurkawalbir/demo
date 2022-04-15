import React, { useCallback, useState, useEffect, useMemo } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
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
import { emptyList, emptyObject, FORM_SAVE_STATUS, FLOW_GROUP_FORM_KEY } from '../../../utils/constants';
import { getFlowGroup } from '../../../utils/flows';
import getRoutePath from '../../../utils/routePaths';

const paths = ['flowgroups/add', 'flowgroups/edit'];

const getFieldMeta = (integrationId, groupName, flowsWithGroupId, isEdit, flowGroupId) => ({
  fieldMap: {
    name: {
      id: 'name',
      type: 'flowgroupname',
      label: 'Name',
      integrationId,
      defaultValue: groupName,
      flowIds: flowsWithGroupId.map(flow => flow._id),
      isEdit,
      required: true,
      flowGroupId,
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
  layout: {
    fields: ['name', '_flowIds'],
  },
});

function FlowgroupForm({ integrationId, groupId, isEdit }) {
  const history = useHistory();
  const dispatch = useDispatch();
  const [enqueuesnackbar] = useEnqueueSnackbar();
  const [remountCount, setRemountCount] = useState(0);
  const handleClose = history.goBack;
  const flowGroupings = useSelectorMemo(selectors.mkFlowGroupingsTiedToIntegrations, integrationId);
  const flowsTiedToIntegrations = useSelectorMemo(selectors.mkAllFlowsTiedToIntegrations, integrationId, []) || emptyList;

  const formFlowGroupName = useSelector(state => selectors.formState(state, FLOW_GROUP_FORM_KEY)?.fields?.name.value);
  const newGroupId = getFlowGroup(flowGroupings, formFlowGroupName, '')?._id;
  const asyncTaskStatus = useSelector(state => selectors.asyncTaskStatus(state, FLOW_GROUP_FORM_KEY));
  const [isFormSaveTriggered, setIsFormSaveTriggered] = useState(false);

  const { groupName, flowGroupId, flowsWithGroupId = [] } = useMemo(() => {
    if (!isEdit) return {};

    return {
      groupName: getFlowGroup(flowGroupings, '', groupId)?.name,
      flowGroupId: groupId,
      flowsWithGroupId: flowsTiedToIntegrations.filter(flow => flow._flowGroupingId === groupId),
    };
  }, [isEdit, flowGroupings, groupId, flowsTiedToIntegrations]);

  const fieldMeta = getFieldMeta(integrationId, groupName, flowsWithGroupId, isEdit, flowGroupId);
  const { status: flowGroupSaveStatus, message } = useSelector(state => selectors.flowGroupStatus(state, integrationId), shallowEqual) || emptyObject;

  useFormInitWithPermissions({formKey: FLOW_GROUP_FORM_KEY, fieldMeta, remount: remountCount});

  useEffect(() => {
    if (flowGroupSaveStatus === 'Failed') {
      enqueuesnackbar({ message: message || 'Flow group failed to save' });
    }
  }, [enqueuesnackbar, flowGroupSaveStatus, message]);

  useEffect(() => {
    if (!isFormSaveTriggered || !(asyncTaskStatus === FORM_SAVE_STATUS.COMPLETE)) {
      return;
    }

    // if the create flow group form is saved
    // we will open the edit flow group form of the newly created flow group
    if (!isEdit) {
      history.replace(
        getRoutePath(`/integrations/${integrationId}/flows/sections/${newGroupId}/flowgroups/edit`)
      );
    }
  }, [history, isFormSaveTriggered, asyncTaskStatus, integrationId, newGroupId, isEdit]);

  const handleSave = useCallback(closeAfterSave => {
    dispatch(actions.resource.integrations.flowGroups.createOrUpdate(integrationId, flowGroupId, FLOW_GROUP_FORM_KEY));
    if (closeAfterSave) {
      return handleClose();
    }
    setIsFormSaveTriggered(true);
  }, [dispatch, integrationId, flowGroupId, handleClose]);

  const remountForm = useCallback(() => {
    setRemountCount(remountCount => remountCount + 1);
  }, []);

  return (
    <LoadResources integrationId={integrationId} required resources="flows">
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
