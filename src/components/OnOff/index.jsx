import { useDispatch, useSelector } from 'react-redux';
import actions from '../../actions';
import SwitchOnOff from '../SwitchToggle';
import useConfirmDialog from '../ConfirmDialog';
import * as selectors from '../../reducers';
import {
  LICENSE_EXPIRED,
  LICENSE_TRIAL_NOT_STARTED,
  LICENSE_TRIAL_EXPIRED,
} from '../../utils/constants';

export default {
  label: 'Off/On',
  component: function EnableOrDisableFlow({
    resource: flow,
    disabled,
    storeId,
  }) {
    // TODO: Connector specific things to be added for schedule drawer incase of !isDisabled && isConnector
    const { confirmDialog } = useConfirmDialog();
    const dispatch = useDispatch();
    const licenseActionDetails = useSelector(state =>
      selectors.integratorLicenseWithMetadata(state)
    );
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
                    null,
                    { '/flowId': flow._id, '/disabled': !enable },
                    { action: 'flowEnableDisable' }
                  )
                );
              } else {
                if (enable) {
                  if (licenseActionDetails.hasSubscription) {
                    if (licenseActionDetails.hasExpired) {
                      return dispatch(
                        actions.api.failure('', '', LICENSE_EXPIRED)
                      );
                    }
                  } else if (!licenseActionDetails.trialEndDate) {
                    return dispatch(
                      actions.api.failure('', '', LICENSE_TRIAL_NOT_STARTED)
                    );
                  } else if (
                    licenseActionDetails.trialEndDate &&
                    !licenseActionDetails.inTrial
                  ) {
                    return dispatch(
                      actions.api.failure('', '', LICENSE_TRIAL_EXPIRED)
                    );
                  }
                }

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
