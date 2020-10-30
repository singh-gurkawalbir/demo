import React, { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Button } from '@material-ui/core';
import DynaForm from '../../../../../components/DynaForm';
import DynaSubmit from '../../../../../components/DynaForm/DynaSubmit';
import actions from '../../../../../actions';
import RightDrawer from '../../../../../components/drawer/Right/V2';
import DrawerHeader from '../../../../../components/drawer/Right/V2/DrawerHeader';
import DrawerContent from '../../../../../components/drawer/Right/V2/DrawerContent';
import DrawerFooter from '../../../../../components/drawer/Right/V2/DrawerFooter';
import { selectors } from '../../../../../reducers';
import useFormInitWithPermissions from '../../../../../hooks/useFormInitWithPermissions';
import ButtonGroup from '../../../../../components/ButtonGroup';

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
          'value',
        )
      );
      dispatch(
        actions.suiteScript.resource.commitStaged(
          ssLinkedConnectionId,
          flow._integrationId,
          'flows',
          flowId,
          'value',
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
    <RightDrawer path="settings" width="medium">
      <DrawerHeader title="Settings" />
      <DrawerContent>
        <DynaForm fieldMeta={fieldMeta} formKey={formKey} />
      </DrawerContent>
      <DrawerFooter>
        <ButtonGroup>
          <DynaSubmit
            formKey={formKey}
            onClick={handleSubmit} color="primary" variant="outlined">
            Save
          </DynaSubmit>
          <Button onClick={handleClose} variant="text" color="primary">
            Cancel
          </Button>
        </ButtonGroup>
      </DrawerFooter>
    </RightDrawer>
  );
}
