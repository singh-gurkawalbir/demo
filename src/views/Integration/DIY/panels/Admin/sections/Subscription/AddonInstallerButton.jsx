import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import makeStyles from '@mui/styles/makeStyles';
import { useDispatch, useSelector } from 'react-redux';
import { Spinner } from '@celigo/fuse-ui';
import { selectors } from '../../../../../../../reducers';
import useConfirmDialog from '../../../../../../../components/ConfirmDialog';
import actions from '../../../../../../../actions';
import Loader from '../../../../../../../components/Loader'; import OutlinedButton from '../../../../../../../components/Buttons/OutlinedButton';
import { message } from '../../../../../../../utils/messageStore';

const useStyles = makeStyles(theme => ({
  unInstallBtn: {
    color: theme.palette.error.main,
    borderColor: theme.palette.error.main,
    background: 'none',
    '&:hover': {
      background: 'none',
      borderColor: theme.palette.error.main,
      color: theme.palette.error.light,
    },
  },
}));

export default function AddonInstallerButton({ resource }) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const [isInProgress, setIsInProgressStatus] = useState(false);
  const installInprogress = useSelector(
    state => selectors.isAddOnInstallInProgress(state, resource.id)
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
    <OutlinedButton
      data-test="addOnInstall"
      size="small"
      error={resource.status === 'installed'}
      className={clsx({[classes.unInstallBtn]: resource.status === 'installed'})}
      onClick={() => onClick(resource)}>
      {getLabel()}
    </OutlinedButton>
  );
}
