import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { Button, IconButton } from '@material-ui/core';
import DynaForm from '../../../../components/DynaForm';
import DynaSubmit from '../../../../components/DynaForm/DynaSubmit';
import Close from '../../../../components/icons/CloseIcon';
import { resourceList, getNextDataFlows } from '../../../../reducers';
import actions from '../../../../actions';
import SettingsDrawerRouter from '../RightDrawer';
import TitleBar from '../TitleBar';

const useStyles = makeStyles(theme => ({
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: 2,
  },
  settingsContent: {
    padding: theme.spacing(2),
  },
}));

export default function SettingsDrawer({ flow, isViewMode, ...props }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const { resources: integrations } = useSelector(state =>
    resourceList(state, { type: 'integrations' })
  );
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
        defaultDisabled: flow && !!flow._integrationId,
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
    },
    layout: {
      fields: ['name', 'description', '_integrationId', '_runNextFlowIds'],
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

    dispatch(actions.resource.patchStaged(flow._id, patchSet, 'value'));
    dispatch(actions.resource.commitStaged('flows', flow._id, 'value'));
    history.goBack();
  };

  return (
    <SettingsDrawerRouter {...props} path="settings">
      <IconButton
        data-test="closeFlowSchedule"
        aria-label="Close"
        className={classes.closeButton}
        onClick={handleClose}>
        <Close />
      </IconButton>
      <TitleBar title="Settings" />
      <div className={classes.settingsContent}>
        <DynaForm disabled={isViewMode} fieldMeta={fieldMeta} render>
          <DynaSubmit onClick={handleSubmit} color="primary" variant="outlined">
            Save
          </DynaSubmit>
          <Button onClick={handleClose} variant="text" color="primary">
            Cancel
          </Button>
        </DynaForm>
      </div>
    </SettingsDrawerRouter>
  );
}
