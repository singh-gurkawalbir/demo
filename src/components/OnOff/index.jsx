import { useDispatch } from 'react-redux';
import actions from '../../actions';
import SwitchOnOff from '../SwitchToggle';
import { confirmDialog } from '../ConfirmDialog';

export default {
  label: 'Off/On',
  component: function EnableOrDisableFlow({
    resource: flow,
    disabled,
    storeId,
  }) {
    // TODO: Connector specific things to be added for schedule drawer incase of !isDisabled && isConnector

    const dispatch = useDispatch();
    const enableOrDisableFlow = () => {
      const enable = flow.disabled;
      const message = [
        'Are you sure you want to ',
        enable ? 'enable' : 'disable',
        flow.name || flow._id,
        'flow?',
      ].join(' ');

      confirmDialog({
        title: 'Confirm',
        message,
        buttons: [
          {
            label: 'Cancel',
          },
          {
            label: 'Yes',
            onClick: () => {
              if (flow._connectorId) {
                dispatch(
                  actions.integrationApp.settings.update(
                    flow._integrationId,
                    flow._id,
                    storeId,
                    { '/flowId': flow._id, '/disabled': !enable },
                    { action: 'flowEnableDisable' }
                  )
                );
              } else {
                const patchSet = [
                  {
                    op: 'replace',
                    path: '/disabled',
                    value: !enable,
                  },
                ];

                dispatch(
                  actions.resource.patchStaged(flow._id, patchSet, 'value')
                );
                dispatch(
                  actions.resource.commitStaged('flows', flow._id, 'value')
                );
              }
            },
          },
        ],
      });
    };

    return (
      <SwitchOnOff
        disabled={disabled}
        on={!disabled && !flow.disabled}
        onClick={enableOrDisableFlow}
        data-test="switchFlowOnOff"
      />
    );
  },
};
