import React, { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import DynaForm from '../../../../components/DynaForm';
import DynaSubmit from '../../../../components/DynaForm/DynaSubmit';
import actions from '../../../../actions';
import RightDrawer from '../../../../components/drawer/Right';
import * as selectors from '../../../../reducers';
import { isJsonString } from '../../../../utils/string';
import useSaveStatusIndicator from '../../../../hooks/useSaveStatusIndicator';

const useStyles = makeStyles(theme => ({
  scheduleContainer: {
    width: '100%',
    overflowX: 'hidden',
    marginTop: -1,
    padding: theme.spacing(-1),
  },
}));

export default function SettingsDrawer({
  flow,
  integrationId,
  resourceType,
  resourceId,
}) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const nextDataFlows = useSelector(state =>
    selectors.nextDataFlowsForFlow(state, flow)
  );
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
          required: true
        },
        description: {
          id: 'description',
          name: 'description',
          type: 'text',
          helpKey: 'flow.description',
          label: 'Description',
          multiline: true,
          defaultValue: flow && flow.description,
        },
        _runNextFlowIds: {
          id: '_runNextFlowIds',
          name: '_runNextFlowIds',
          type: 'multiselect',
          placeholder: 'Please select flow',
          helpKey: 'flow._runNextFlowIds',
          label: 'Next data flow:',
          displayEmpty: true,
          defaultValue: (flow && flow._runNextFlowIds) || [],
          options: [
            {
              items: nextDataFlows.length
                ? nextDataFlows.map(i => ({ label: i.name, value: i._id }))
                : [
                  {
                    label: "You don't have any other active flows",
                    disabled: true,
                    value: '',
                  },
                ],
            },
          ],
        },
        settings: {
          id: 'settings',
          name: 'settings',
          type: 'settings',
          label: 'Custom',
          defaultValue: flow && flow.settings,
        },
      },
      layout: {
        containers: [
          {
            type: 'collapse',
            containers: [
              {
                collapsed: true,
                label: 'General',
                fields: ['name', 'description', '_runNextFlowIds'],
              },
            ],
          },
          {
            fields: ['settings']
          },
        ],
      },
    }),
    [flow, nextDataFlows]
  );
  const validationHandler = field => {
    // Incase of invalid json throws error to be shown on the field

    if (field && field.id === 'settings') {
      if (
        field.value &&
        typeof field.value === 'string' &&
        !isJsonString(field.value)
      ) {
        return 'Settings must be a valid JSON';
      }
    }
  };

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
          path: '/description',
          value: formVal.description,
        },
        {
          op: 'replace',
          path: '/_integrationId',
          value: integrationId,
        },
        {
          op: 'replace',
          path: '/_runNextFlowIds',
          value: formVal._runNextFlowIds,
        },
      ];

      if (Object.hasOwnProperty.call(formVal, 'settings')) {
        // dont submit the form if there is validation error
        // REVIEW: re-visit once Surya's form PR is merged
        if (formVal && formVal.settings && formVal.settings.__invalid) return;
        patchSet.push({
          op: 'replace',
          path: '/settings',
          value: formVal && formVal.settings,
        });
      }

      dispatch(actions.resource.patchStaged(flow._id, patchSet, 'value'));
      dispatch(actions.resource.commitStaged('flows', flow._id, 'value'));
    },
    [dispatch, integrationId, flow._id]
  );

  const { submitHandler, disableSave, defaultLabels} = useSaveStatusIndicator(
    {
      path: `/flows/${flow._id}`,
      onSave: handleSubmit,
      onClose: handleClose,
    }
  );

  return (
    <RightDrawer
      path="settings"
      title="Settings"
      width="medium">
      <div className={classes.scheduleContainer}>
        <DynaForm
          integrationId={integrationId}
          resourceType={resourceType}
          resourceId={resourceId}
          fieldMeta={fieldMeta}
          validationHandler={validationHandler}
          render>
          <DynaSubmit
            resourceType={resourceType}
            resourceId={resourceId}
            onClick={submitHandler()}
            disabled={disableSave}
            color="primary"
            variant="outlined">
            {defaultLabels.saveLabel}
          </DynaSubmit>
          <DynaSubmit
            resourceType={resourceType}
            resourceId={resourceId}
            onClick={submitHandler(true)}
            disabled={disableSave}
            color="primary"
            variant="outlined">
            {defaultLabels.saveAndCloseLabel}
          </DynaSubmit>
          <Button onClick={handleClose} variant="text" color="primary">
            Cancel
          </Button>
        </DynaForm>
      </div>
    </RightDrawer>
  );
}
