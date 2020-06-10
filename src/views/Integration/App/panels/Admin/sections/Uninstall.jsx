import React from 'react';
import { useSelector } from 'react-redux';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { Typography, Button, Divider } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import PanelHeader from '../../../../../../components/PanelHeader';
import useConfirmDialog from '../../../../../../components/ConfirmDialog';
import * as selectors from '../../../../../../reducers';
import DeleteIcon from '../../../../../../components/icons/TrashIcon';
import { getIntegrationAppUrlName } from '../../../../../../utils/integrationApps';

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

export default function UninstallSection({ storeId, integrationId }) {
  const classes = useStyles();
  const history = useHistory();
  const match = useRouteMatch();
  const isFrameWork2 = useSelector(state => selectors.isIntegrationAppVersion2(state, integrationId));
  const { confirmDialog } = useConfirmDialog();
  const integration =
    useSelector(state =>
      selectors.integrationAppSettings(state, integrationId)
    ) || {};
  const integrationAppName = getIntegrationAppUrlName(integration.name);
  const handleUninstall = () => {
    confirmDialog({
      title: 'Uninstall',
      message: 'Are you sure you want to uninstall',
      buttons: [
        {
          label: 'Cancel',
        },
        {
          label: 'Yes',
          onClick: () => {
            if (isFrameWork2) {
              const {url} = match;
              const urlExtractFields = url.split('/');
              const index = urlExtractFields.findIndex(
                element => element === 'child'
              );

              // REVIEW: @ashu, review with Dave once
              if (index === -1) {
                history.push(
                  `/pg/integrationapps/${integrationAppName}/${integrationId}/uninstall`
                );
              } else {
                history.push(
                  `/pg/integrationapps/${integrationAppName}/${integrationId}/uninstall/${urlExtractFields[index + 1]}`
                );
              }
            } else if (
              integration.settings &&
              integration.settings.supportsMultiStore
            ) {
              history.push(
                `/pg/integrationapps/${integrationAppName}/${integrationId}/uninstall/${storeId}`
              );
            } else {
              history.push(
                `/pg/integrationapps/${integrationAppName}/${integrationId}/uninstall`
              );
            }
          },
        },
      ],
    });
  };

  return (
    <>
      <PanelHeader title="Uninstall" />

      <div className={classes.content}>
        <Typography variant="h5">
          Use this page to uninstall this instance (i.e. this tile) of the
          Integration App. Uninstalling an Integration App will remove all
          components, including the integration tile, from your integrator.io
          account. After uninstalling you can re-install from the marketplace as
          long as you have a valid subscription. Please be very certain that you
          want to uninstall as this action cannot be undone.
        </Typography>
        <Divider className={classes.divider} />
        <Typography variant="h5">
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
