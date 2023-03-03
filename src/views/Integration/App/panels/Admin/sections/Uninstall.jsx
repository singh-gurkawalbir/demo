import React from 'react';
import { useHistory } from 'react-router-dom';
import { Typography, Divider } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import PanelHeader from '../../../../../../components/PanelHeader';
import useConfirmDialog from '../../../../../../components/ConfirmDialog';
import { selectors } from '../../../../../../reducers';
import DeleteIcon from '../../../../../../components/icons/TrashIcon';
import { getEmptyMessage, getIntegrationAppUrlName, isParentViewSelected } from '../../../../../../utils/integrationApps';
import getRoutePath from '../../../../../../utils/routePaths';
import useSelectorMemo from '../../../../../../hooks/selectors/useSelectorMemo';
import OutlinedButton from '../../../../../../components/Buttons/OutlinedButton';
import messageStore from '../../../../../../utils/messageStore';

const useStyles = makeStyles(theme => ({
  button: {
    margin: theme.spacing(3, 0, 3, 2),
  },
  divider: {
    margin: theme.spacing(2, 0),
  },
  message: {
    padding: theme.spacing(0, 2),
  },
  parentViewMessage: {
    padding: theme.spacing(2),
  },
}));

export default function UninstallSection({ childId, integrationId }) {
  const classes = useStyles();
  const history = useHistory();
  const { confirmDialog } = useConfirmDialog();
  const integration = useSelectorMemo(selectors.mkIntegrationAppSettings, integrationId) || {};
  const isParentView = isParentViewSelected(integration, childId);
  const integrationAppName = getIntegrationAppUrlName(integration.name);
  const handleUninstall = () => {
    confirmDialog({
      title: 'Confirm uninstall',
      message: messageStore('SURE_UNINSTALL'),
      buttons: [
        {
          label: 'Uninstall',
          onClick: () => {
            if (
              integration.settings &&
              integration.settings.supportsMultiStore
            ) {
              history.push(
                getRoutePath(`/integrationapps/${integrationAppName}/${integrationId}/uninstall/child/${childId}`)
              );
            } else {
              history.push(
                getRoutePath(`/integrationapps/${integrationAppName}/${integrationId}/uninstall`)
              );
            }
          },
        },
        {
          label: 'Cancel',
          variant: 'text',
        },
      ],
    });
  };

  if (isParentView) {
    return (
      <div className={classes.root}>
        <PanelHeader title="Uninstall" />
        <Divider />
        <div className={classes.parentViewMessage}>
          <span>
            {getEmptyMessage(integration?.settings?.storeLabel, 'uninstall')}
          </span>
        </div>
      </div>
    );
  }

  return (
    <>
      <PanelHeader title="Uninstall" />

      <div>
        <Typography className={classes.message}>
          Use this page to uninstall this instance (i.e. this tile) of the
          Integration App. Uninstalling an Integration App will remove all
          components, including the integration tile, from your integrator.io
          account. After uninstalling you can re-install from the marketplace as
          long as you have a valid subscription. Please be very certain that you
          want to uninstall as this action cannot be undone.
        </Typography>
        <Divider className={classes.divider} />
        <Typography className={classes.message}>
          Once you uninstall this Integration App there is no going back. Please
          be certain.
        </Typography>
        <OutlinedButton
          data-test="uninstallConnector"
          error
          className={classes.button}
          endIcon={<DeleteIcon />}
          onClick={handleUninstall}>
          Uninstall
        </OutlinedButton>
      </div>
    </>
  );
}
