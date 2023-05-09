import React, { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { TextButton } from '@celigo/fuse-ui';
import DynaForm from '../../../../../components/DynaForm';
import DynaSubmit from '../../../../../components/DynaForm/DynaSubmit';
import actions from '../../../../../actions';
import RightDrawer from '../../../../../components/drawer/Right';
import DrawerHeader from '../../../../../components/drawer/Right/DrawerHeader';
import DrawerContent from '../../../../../components/drawer/Right/DrawerContent';
import DrawerFooter from '../../../../../components/drawer/Right/DrawerFooter';
import { selectors } from '../../../../../reducers';
import useFormInitWithPermissions from '../../../../../hooks/useFormInitWithPermissions';
import ActionGroup from '../../../../../components/ActionGroup';

export default function SettingsDrawer({ ssLinkedConnectionId, integrationId, flowId }) {
  const dispatch = useDispatch();
  const history = useHistory();
  const flow = useSelector(state =>
    selectors.suiteScriptResource(state, {
      resourceType: 'flows',
      id: flowId,
      ssLinkedConnectionId,
    })
  );
  const isIntegrationApp = useSelector(state => !!selectors.suiteScriptResource(state, {resourceType: 'integrations', id: integrationId, ssLinkedConnectionId})?._connectorId);
  const nextDataFlows = useSelector(state =>
    selectors.suiteScriptResourceList(state, {
      ssLinkedConnectionId,
      resourceType: 'nextFlows',
    })
  );
  const isViewMode = useSelector(state => !selectors.userHasManageAccessOnSuiteScriptAccount(state, ssLinkedConnectionId));
  const handleClose = useCallback(() => history.goBack(), [history]);
  const fieldMeta = useMemo(
    () => ({
      fieldMap: {
        name: {
          id: 'name',
          name: 'name',
          type: 'text',
          helpKey: 'flow.name',
          label: 'Name',
          defaultValue: flow && flow.name,
        },
        _runNextFlowIds: {
          id: 'nextDataFlowId',
          name: 'nextDataFlowId',
          type: 'select',
          placeholder: 'Please select flow',
          helpKey: 'flow._runNextFlowIds',
          label: 'Next integration flow:',
          displayEmpty: true,
          defaultValue:
            flow &&
            flow.scheduleDetails &&
            flow.scheduleDetails.nextDataFlowId &&
            flow.scheduleDetails.nextDataFlowId.toString(),
          options: [
            {
              items: nextDataFlows.map(f => ({
                label: `${f.integrationName} - ${f.ioFlowName ||
                  f.name ||
                  f._id}`,
                value: f._id,
              })),
            },
          ],
        },
      },
    }),
    [flow, nextDataFlows]
  );

  const handleSubmit = useCallback(
    formVal => {
      const patchSet = [
        {
          op: 'replace',
          path: '/name',
          value: formVal.name,
        },
        {
          op: 'replace',
          path: '/nextDataFlowId',
          value: formVal.nextDataFlowId,
        },
      ];

      dispatch(
        actions.suiteScript.resource.patchStaged(
          ssLinkedConnectionId,
          'flows',
          flowId,
          patchSet,
        )
      );
      dispatch(
        actions.suiteScript.resource.commitStaged(
          ssLinkedConnectionId,
          flow._integrationId,
          'flows',
          flowId,
        )
      );
      history.goBack();
    },
    [dispatch, flow._integrationId, flowId, history, ssLinkedConnectionId]
  );

  const formKey = useFormInitWithPermissions({
    fieldMeta,
    disabled: isViewMode || isIntegrationApp,
  });

  return (
    <RightDrawer isSuitescript path="settings" width="medium">
      <DrawerHeader title="Settings" />
      <DrawerContent>
        <DynaForm formKey={formKey} />
      </DrawerContent>
      <DrawerFooter>
        <ActionGroup>
          <DynaSubmit
            formKey={formKey}
            onClick={handleSubmit}
            color="primary"
            variant="outlined">
            Save
          </DynaSubmit>
          <TextButton onClick={handleClose}>
            Cancel
          </TextButton>
        </ActionGroup>
      </DrawerFooter>
    </RightDrawer>
  );
}
