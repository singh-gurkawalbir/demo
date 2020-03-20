import React, { useEffect, useState } from 'react';
import { Button } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import * as selectors from '../../../../../reducers';
import useConfirmDialog from '../../../../../components/ConfirmDialog';
import actions from '../../../../../actions';
import Spinner from '../../../../../components/Spinner';
import Loader from '../../../../../components/Loader';

export default function AddonInstallerButton({ resource }) {
  const dispatch = useDispatch();
  const [isInProgress, setIsInProgressStatus] = useState(false);
  const { installerInprogress } = useSelector(
    state => selectors.isAddOnInstallerInProgress(state, resource.id),
    (left, right) => left.installerInprogress === right.installerInprogress
  );

  useEffect(() => {
    if (!installerInprogress) {
      setIsInProgressStatus(false);
    }
  }, [dispatch, installerInprogress]);
  const { confirmDialog } = useConfirmDialog();
  const onClick = resource => {
    if (resource.status === 'installed') {
      confirmDialog({
        title: `Delete all flows and configurations for add-on ${resource.name} ?`,
        message: `Uninstalling add-on ${resource.name} will delete all of its flows and configurations permanently. This cannot be undone.If you need this add-on again, you will need to reinstall from the marketplace.`,
        buttons: [
          {
            label: 'Cancel',
          },
          {
            label: 'Uninstall',
            onClick: () => {
              dispatch(
                actions.integrationApp.isAddonInstallerInprogress(
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
                  resource.id,
                  { action: 'addOninstaller' }
                )
              );
            },
          },
        ],
      });
    } else if (resource.status === 'paritallyUninstalled') {
      dispatch(
        actions.integrationApp.isAddonInstallerInprogress(true, resource.id)
      );
      setIsInProgressStatus(true);
      dispatch(
        actions.integrationApp.uninstaller.stepUninstall(
          resource.storeId,
          resource.integrationId,
          resource.uninstallerFunction,
          resource.id,
          { action: 'addOninstaller' }
        )
      );
    } else if (
      resource.status === 'available' ||
      resource.status === 'partiallyInstalled'
    ) {
      //       app.mask(window.$(app.currentPage.el), 'Installing ' + self.name + ' add-on...')

      dispatch(
        actions.integrationApp.isAddonInstallerInprogress(true, resource.id)
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
    } else if (resource.status === 'paritallyUninstalled') {
      return 'Resume Uninstall';
    } else if (resource.status === 'available') {
      return 'Install';
    } else if (resource.status === 'partiallyInstalled') {
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
