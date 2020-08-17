import React, { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import DynaForm from '../../../../components/DynaForm';
import DynaSubmit from '../../../../components/DynaForm/DynaSubmit';
import actions from '../../../../actions';
import RightDrawer from '../../../../components/drawer/Right';
import { selectors } from '../../../../reducers';
import { isJsonString } from '../../../../utils/string';
import useSaveStatusIndicator from '../../../../hooks/useSaveStatusIndicator';
import { STANDALONE_INTEGRATION } from '../../../../utils/constants';

const useStyles = makeStyles(theme => ({
  scheduleContainer: {
    width: '100%',
    overflowX: 'hidden',
    '& > div:first-child': {
      marginLeft: theme.spacing(-1),
      paddingRight: 0,
    },
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
          required: true,
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
          label: 'Next integration flow:',
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
            fields: ['settings'],
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
          path: '/_runNextFlowIds',
          value: formVal._runNextFlowIds,
        },
      ];

      if (integrationId && integrationId !== STANDALONE_INTEGRATION.id) {
        patchSet.push({
          op: 'replace',
          path: '/_integrationId',
          value: integrationId,
        });
      }

      if (Object.hasOwnProperty.call(formVal, 'settings')) {
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

  const validateAndSubmit = useCallback(closeOnSave => formVal => {
    if (Object.hasOwnProperty.call(formVal, 'settings')) {
      // dont submit the form if there is validation error
      // REVIEW: re-visit once Surya's form PR is merged
      if (formVal && formVal.settings && formVal.settings.__invalid) {
        return;
      }
    }
    submitHandler(closeOnSave)(formVal);
  }, [submitHandler]);

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
            data-test="saveFlowSettings"
            onClick={validateAndSubmit()}
            disabled={disableSave}>
            {defaultLabels.saveLabel}
          </DynaSubmit>
          <DynaSubmit
            resourceType={resourceType}
            resourceId={resourceId}
            data-test="saveAndCloseFlowSettings"
            onClick={validateAndSubmit(true)}
            disabled={disableSave}
            color="secondary">
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
