import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Spinner } from '@celigo/fuse-ui';
import { selectors } from '../../../../../../../reducers';
import useConfirmDialog from '../../../../../../../components/ConfirmDialog';
import actions from '../../../../../../../actions';
import Loader from '../../../../../../../components/Loader';
import FilledButton from '../../../../../../../components/Buttons/FilledButton';
import { message } from '../../../../../../../utils/messageStore';

export default function AddonInstallerButton({ resource, ...rest }) {
  const dispatch = useDispatch();
  const [isInProgress, setIsInProgressStatus] = useState(false);
  const installInprogress = useSelector(
    state => selectors.isAddOnInstallInProgress(state, resource.id)
  );
  const isLicenseExpired = useSelector(state => selectors.isIntegrationAppLicenseExpired(state, resource?.integrationId));

  useEffect(() => {
    if (!installInprogress) {
      setIsInProgressStatus(false);
    }
  }, [dispatch, installInprogress]);
  const { confirmDialog } = useConfirmDialog();
  const onClick = resource => {
    if (resource.status === 'installed') {
      confirmDialog({
        title: 'Confirm uninstall',
        message: message.SURE_UNINSTALL,
        buttons: [
          {
            label: 'Uninstall',
            onClick: () => {
              dispatch(
                actions.integrationApp.isAddonInstallInprogress(
                  true,
                  resource.id
                )
              );
              setIsInProgressStatus(true);
              dispatch(
                actions.integrationApp.uninstaller.stepUninstall(
                  resource.storeId,
                  resource.integrationId,
                  resource.uninstallerFunction,
                  resource.id
                )
              );
            },
          },
          {
            label: 'Cancel',
            variant: 'text',
          },
        ],
      });
    } else if (resource.status === 'paritallyUninstalled') {
      dispatch(
        actions.integrationApp.isAddonInstallInprogress(true, resource.id)
      );
      setIsInProgressStatus(true);
      dispatch(
        actions.integrationApp.uninstaller.stepUninstall(
          resource.storeId,
          resource.integrationId,
          resource.uninstallerFunction,
          resource.id
        )
      );
    } else if (
      resource.status === 'available' ||
      resource.status === 'partiallyInstalled'
    ) {
      dispatch(
        actions.integrationApp.isAddonInstallInprogress(true, resource.id)
      );
      setIsInProgressStatus(true);
      dispatch(
        actions.integrationApp.installer.installStep(
          resource.integrationId,
          resource.installerFunction,
          resource.storeId,
          resource.id
        )
      );
    }
  };

  const getLabel = () => {
    if (resource.status === 'installed') {
      return 'Uninstall';
    }
    if (resource.status === 'paritallyUninstalled') {
      return 'Resume uninstall';
    }
    if (resource.status === 'available') {
      return 'Install';
    }
    if (resource.status === 'partiallyInstalled') {
      return 'Resume install';
    }
  };

  const getInprogressMessage = () => {
    if (
      resource.status === 'available' ||
      resource.status === 'partiallyInstalled'
    ) {
      return `Installing ${resource.name} add-on...`;
    }

    return `Uninstalling ${resource.name} add-on...`;
  };

  if (isInProgress) {
    return (
      <Loader open>
        {getInprogressMessage()}
        <Spinner />
      </Loader>
    );
  }

  return (
    <FilledButton
      data-test="addOnInstall"
      size="small"
      error={resource.status === 'installed'}
      disabled={resource.status === 'available' && isLicenseExpired}
      {...rest}
      onClick={() => onClick(resource)}>
      {getLabel()}
    </FilledButton>
  );
}
