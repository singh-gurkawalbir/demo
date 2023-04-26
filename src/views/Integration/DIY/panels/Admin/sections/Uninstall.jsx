import React from 'react';
import { useSelector } from 'react-redux';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { Typography, Divider } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import PanelHeader from '../../../../../../components/PanelHeader';
import useConfirmDialog from '../../../../../../components/ConfirmDialog';
import { selectors } from '../../../../../../reducers';
import DeleteIcon from '../../../../../../components/icons/TrashIcon';
import { getIntegrationAppUrlName } from '../../../../../../utils/integrationApps';
import getRoutePath from '../../../../../../utils/routePaths';
import useSelectorMemo from '../../../../../../hooks/selectors/useSelectorMemo';
import OutlinedButton from '../../../../../../components/Buttons/OutlinedButton';
import { message } from '../../../../../../utils/messageStore';

const useStyles = makeStyles(theme => ({
  content: {
    marginLeft: theme.spacing(2),
  },
  button: {
    margin: theme.spacing(3, 0),
  },
  divider: {
    marginTop: '30px',
    marginBottom: '30px',
  },
}));

export default function UninstallSection({ childId, integrationId }) {
  const classes = useStyles();
  const history = useHistory();
  const match = useRouteMatch();
  const { confirmDialog } = useConfirmDialog();

  const integration = useSelectorMemo(selectors.mkIntegrationAppSettings, integrationId) || {};

  const isFrameWork2 = useSelector(state => selectors.isIntegrationAppVersion2(state, integrationId, true));
  const integrationAppName = getIntegrationAppUrlName(integration.name);
  const handleUninstall = () => {
    confirmDialog({
      title: 'Confirm uninstall',
      message: message.SURE_UNINSTALL,
      buttons: [
        {
          label: 'Uninstall',
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
                  getRoutePath(`/integrationapps/${integrationAppName}/${integrationId}/uninstall`)
                );
              } else {
                history.push(
                  getRoutePath(`/integrationapps/${integrationAppName}/${integrationId}/uninstall/child/${urlExtractFields[index + 1]}`)
                );
              }
            } else if (
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

  return (
    <>
      <PanelHeader title="Uninstall" />

      <div className={classes.content}>
        <Typography>
          {message.SUBSCRIPTION.UNINSTALL_INSTANCE}
        </Typography>
        <Divider className={classes.divider} />
        <Typography>
          {message.SUBSCRIPTION.UNINSTALL_INFO}
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
