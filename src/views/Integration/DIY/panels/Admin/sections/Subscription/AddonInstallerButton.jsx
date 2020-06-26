import React, { useEffect, useState } from 'react';
import { Button } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import * as selectors from '../../../../../../../reducers';
import useConfirmDialog from '../../../../../../../components/ConfirmDialog';
import actions from '../../../../../../../actions';
import Spinner from '../../../../../../../components/Spinner';
import Loader from '../../../../../../../components/Loader';

export default function AddonInstallerButton({ resource }) {
  const dispatch = useDispatch();
  const [isInProgress, setIsInProgressStatus] = useState(false);
  const { installInprogress } = useSelector(
    state => selectors.isAddOnInstallInProgress(state, resource.id),
    (left, right) => left.installerInprogress === right.installerInprogress
  );

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
        message: 'Are you sure you want to uninstall?',
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
            color: 'secondary',
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
      return 'Resume Uninstall';
    }
    if (resource.status === 'available') {
      return 'Install';
    }
    if (resource.status === 'partiallyInstalled') {
      return 'Resume Install';
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
    <Button
      data-test="addOnInstall"
      size="small"
      onClick={() => onClick(resource)}>
      {getLabel()}
    </Button>
  );
}
