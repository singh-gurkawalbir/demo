import { makeStyles } from '@material-ui/core/styles';
import { Button, IconButton } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import SettingsDrawerRouter from '../RightDrawer';
import TitleBar from '../TitleBar';
import DynaForm from '../../../../components/DynaForm';
import DynaSubmit from '../../../../components/DynaForm/DynaSubmit';
import Close from '../../../../components/icons/CloseIcon';
import * as selectors from '../../../../reducers';
import { STANDALONE_INTEGRATION } from '../../../../utils/constants';
import actions from '../../../../actions';

const useStyles = makeStyles(theme => ({
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: 2,
  },
}));

export default function SettingsDrawer({ flow, history, ...props }) {
  const dispatch = useDispatch();
  const { resources: integrations } = useSelector(state =>
    selectors.resourceList(state, { type: 'integrations' })
  );
  let flows = useSelector(
    state => selectors.flowListWithMetadata(state, { type: 'flows' }).resources
  );

  flows =
    flows &&
    flows.filter(
      f =>
        f._integrationId ===
          (flow._integrationId === STANDALONE_INTEGRATION.id
            ? undefined
            : flow._integrationId) && f._id !== flow._id
    );
  const fieldMeta = {
    fieldMap: {
      name: {
        id: 'name',
        name: 'name',
        type: 'text',
        label: 'Name',
        defaultValue: flow && flow.name,
      },
      description: {
        id: 'description',
        name: 'description',
        type: 'text',
        label: 'Description',
        multiline: true,
        defaultValue: flow && flow.description,
      },
      _integrationId: {
        id: '_integrationId',
        name: '_integrationId',
        type: 'select',
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
        disabled: flow && flow._integrationId,
      },
      _runNextFlowIds: {
        id: '_runNextFlowIds',
        name: '_runNextFlowIds',
        type: 'multiselect',
        label: 'Next Data Flow:',
        defaultValue: (flow && flow._runNextFlowIds) || [],
        options: [
          {
            items: flows.map(i => ({ label: i.name, value: i._id })),
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

  const classes = useStyles();

  return (
    <SettingsDrawerRouter {...props} path="settings">
      <IconButton
        data-test="closeFlowSchedule"
        aria-label="Close"
        className={classes.closeButton}
        onClick={() => history.goBack()}>
        <Close />
      </IconButton>
      <TitleBar title="Settings" />
      <DynaForm fieldMeta={fieldMeta} render>
        <DynaSubmit onClick={handleSubmit} color="primary">
          Save
        </DynaSubmit>
        <Button
          onClick={() => history.goBack()}
          variant="contained"
          color="secondary">
          Cancel
        </Button>
      </DynaForm>
    </SettingsDrawerRouter>
  );
}
