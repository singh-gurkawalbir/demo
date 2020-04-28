import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import DynaForm from '../../../../components/DynaForm';
import DynaSubmit from '../../../../components/DynaForm/DynaSubmit';
import {
  resourceList,
  getNextDataFlows,
  developerMode,
} from '../../../../reducers';
import actions from '../../../../actions';
import RightDrawer from '../../../../components/drawer/Right';
import { isJsonString } from '../../../../utils/string';
import useResourceList from '../../../../hooks/useResourceList';

const useStyles = makeStyles(theme => ({
  scheduleContainer: {
    width: '100%',
    overflowX: 'hidden',
    marginTop: -1,
    padding: theme.spacing(-1),
    '& > div': {
      padding: theme.spacing(3, 0),
    },
  },
}));
const integrationsFilterConfig = { type: 'integrations' };

export default function SettingsDrawer({
  flow,
  integrationId,
  resourceType,
  resourceId,
}) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const developerModeOn = useSelector(state => developerMode(state));
  const { resources: integrations } = useResourceList(integrationsFilterConfig);
  const nextDataFlows = useSelector(state => getNextDataFlows(state, flow));
  const handleClose = useCallback(() => history.goBack(), [history]);
  const fieldMeta = {
    fieldMap: {
      name: {
        id: 'name',
        name: 'name',
        type: 'text',
        helpKey: 'flow.name',
        label: 'Name',
        defaultValue: flow && flow.name,
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
      _integrationId: {
        id: '_integrationId',
        name: '_integrationId',
        type: 'select',
        helpKey: 'flow._integrationId',
        label: 'Integration',
        placeholder: 'Standalone Flows',
        defaultValue: flow && flow._integrationId,
        options: [
          {
            items:
              (integrations &&
                integrations.map(integration => ({
                  label: integration.name,
                  value: integration._id,
                }))) ||
              [],
          },
        ],
        defaultDisabled: true,
      },
      _runNextFlowIds: {
        id: '_runNextFlowIds',
        name: '_runNextFlowIds',
        type: 'multiselect',
        placeholder: 'Please select flow',
        helpKey: 'flow._runNextFlowIds',
        label: 'Next Data Flow:',
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
        type: 'editor',
        mode: 'json',
        label: 'Settings',
        showOnDeveloperMode: true,
        defaultValue:
          (flow && flow.settings && JSON.stringify(flow.settings)) || '{}',
      },
    },
    layout: {
      fields: ['name', 'description', '_integrationId', '_runNextFlowIds'],
      type: 'collapse',
      containers: [
        {
          collapsed: true,
          label: 'Custom settings',
          fields: [developerModeOn && 'settings'],
        },
      ],
    },
  };
  const handleSubmit = formVal => {
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
        value: formVal._integrationId,
      },
      {
        op: 'replace',
        path: '/_runNextFlowIds',
        value: formVal._runNextFlowIds,
      },
    ];

    if (Object.hasOwnProperty.call(formVal, 'settings')) {
      let { settings } = formVal;

      if (isJsonString(settings)) {
        settings = JSON.parse(settings);
      } else {
        settings = {};
      }

      patchSet.push({
        op: 'replace',
        path: '/settings',
        value: settings,
      });
    }

    dispatch(actions.resource.patchStaged(flow._id, patchSet, 'value'));
    dispatch(actions.resource.commitStaged('flows', flow._id, 'value'));
    history.goBack();
  };

  const infoTextSettings = `You can enable or disable flow error notifications, 
    known as job errors.  If you have these notifications enabled or disabled for 
    the integration containing this flow, this flow-level setting will override 
    the integration-level setting.`;

  return (
    <RightDrawer path="settings" title="Settings" infoText={infoTextSettings}>
      <div className={classes.scheduleContainer}>
        <DynaForm
          integrationId={integrationId}
          resourceType={resourceType}
          resourceId={resourceId}
          fieldMeta={fieldMeta}
          render>
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
