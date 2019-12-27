import { Fragment, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { Typography, Button, Divider } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import PanelHeader from '../../../../common/PanelHeader';
import { confirmDialog } from '../../../../../../components/ConfirmDialog';
import actions from '../../../../../../actions';
import * as selectors from '../../../../../../reducers';
import DeleteIcon from '../../../../../../components/icons/TrashIcon';

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
  const dispatch = useDispatch();
  const history = useHistory();
  const match = useRouteMatch();
  const integration =
    useSelector(state =>
      selectors.integrationAppSettings(state, integrationId)
    ) || {};
  const { steps: uninstallSteps } = useSelector(state =>
    selectors.integrationUninstallSteps(state, integrationId)
  );

  useEffect(() => {
    if (uninstallSteps && uninstallSteps.length) {
      if (integration.settings && integration.settings.supportsMultiStore) {
        history.push(`/pg/connectors/${integrationId}/uninstall/${storeId}`);
      } else {
        history.push(`/pg/connectors/${integrationId}/uninstall`);
      }
    }
  }, [
    dispatch,
    history,
    integration.settings,
    integrationId,
    match.url,
    storeId,
    uninstallSteps,
  ]);

  const initUninstall = () => {
    dispatch(
      actions.integrationApp.uninstaller.preUninstall(storeId, integrationId)
    );
  };

  const handleUninstall = () => {
    confirmDialog({
      title: 'Uninstall',
      message: `Are you sure you want to uninstall`,
      buttons: [
        {
          label: 'Cancel',
        },
        {
          label: 'Yes',
          onClick: () => {
            initUninstall();
          },
        },
      ],
    });
  };

  return (
    <Fragment>
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
    </Fragment>
  );
}
