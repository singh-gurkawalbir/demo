import React, { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import DynaForm from '../../../../../components/DynaForm';
import DynaSubmit from '../../../../../components/DynaForm/DynaSubmit';
import actions from '../../../../../actions';
import RightDrawer from '../../../../../components/drawer/Right';
import { selectors } from '../../../../../reducers';

const useStyles = makeStyles(() => ({
  settingsContainer: {
    width: '100%',
    overflowX: 'hidden',
    '& > div:first-child': {
      overflow: 'visible',
    },
  },
  suiteScriptFlowSettingsDrawer: {
    '& > .MuiPaper-root': {
      overflow: 'visible',
    },
  },
}));

export default function SettingsDrawer({ ssLinkedConnectionId, integrationId, flowId }) {
  const classes = useStyles();
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
          label: 'Next data flow:',
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

  return (
    <RightDrawer path="settings" title="Settings" width="medium" className={classes.suiteScriptFlowSettingsDrawer}>
      <div className={classes.settingsContainer}>
        <DynaForm fieldMeta={fieldMeta} disabled={isViewMode || isIntegrationApp} render>
          <DynaSubmit onClick={handleSubmit} color="primary" variant="outlined">
            Save
          </DynaSubmit>
          <Button onClick={handleClose} variant="text" color="primary">
            Cancel
          </Button>
        </DynaForm>
      </div>
    </RightDrawer>
  );
}
