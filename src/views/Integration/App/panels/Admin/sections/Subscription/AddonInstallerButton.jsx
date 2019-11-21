import { Button } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import { confirmDialog } from '../../../../../../../components/ConfirmDialog';
import actions from '../../../../../../../actions';

export default function AddonInstallerButton({ resource }) {
  const dispatch = useDispatch();
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
                actions.integrationApp.uninstaller.stepUninstall(
                  resource.storeId,
                  resource.integrationId,
                  resource.uninstallerFunction,
                  resource.id
                )
              );
            },
          },
        ],
      });
    } else if (resource.status === 'paritallyUninstalled') {
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

  return (
    <Button
      data-test="addOnInstall"
      size="small"
      onClick={() => onClick(resource)}>
      {getLabel()}
    </Button>
  );
}
