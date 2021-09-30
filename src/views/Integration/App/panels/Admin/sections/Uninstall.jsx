import React from 'react';
import { useHistory } from 'react-router-dom';
import { Typography, Button, Divider } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import PanelHeader from '../../../../../../components/PanelHeader';
import useConfirmDialog from '../../../../../../components/ConfirmDialog';
import { selectors } from '../../../../../../reducers';
import DeleteIcon from '../../../../../../components/icons/TrashIcon';
import { getEmptyMessage, getIntegrationAppUrlName, isParentViewSelected } from '../../../../../../utils/integrationApps';
import getRoutePath from '../../../../../../utils/routePaths';
import useSelectorMemo from '../../../../../../hooks/selectors/useSelectorMemo';

const useStyles = makeStyles(theme => ({
  content: {
    marginLeft: theme.spacing(2),
  },
  button: {
    margin: theme.spacing(3, 0),
    color: theme.palette.error.main,
    borderColor: theme.palette.error.main,
    '&:hover': {
      borderColor: theme.palette.error.main,
      color: theme.palette.error.light,
    },
  },
  rightIcon: {
    marginLeft: theme.spacing(1),
  },
  divider: {
    marginTop: '30px',
    marginBottom: '30px',
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
      message: 'Are you sure you want to uninstall?',
      buttons: [
        {
          label: 'Uninstall',
          onClick: () => {
            if (
              integration.settings &&
              integration.settings.supportsMultiStore
            ) {
              history.push(
                getRoutePath(`/integrationapps/${integrationAppName}/${integrationId}/uninstall/${childId}`)
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
          color: 'secondary',
        },
      ],
    });
  };

  if (isParentView) {
    return (
      <div className={classes.root}>
        <PanelHeader title="Uninstall" />
        <Divider />
        <div className={classes.content}>
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

      <div className={classes.content}>
        <Typography>
          Use this page to uninstall this instance (i.e. this tile) of the
          Integration App. Uninstalling an Integration App will remove all
          components, including the integration tile, from your integrator.io
          account. After uninstalling you can re-install from the marketplace as
          long as you have a valid subscription. Please be very certain that you
          want to uninstall as this action cannot be undone.
        </Typography>
        <Divider className={classes.divider} />
        <Typography>
          Once you uninstall this Integration App there is no going back. Please
          be certain.
        </Typography>
        <Button
          data-test="uninstallConnector"
          variant="outlined"
          color="secondary"
          className={classes.button}
          onClick={handleUninstall}>
          Uninstall
          <DeleteIcon className={classes.rightIcon} />
        </Button>
      </div>
    </>
  );
}
