import Typography from '@material-ui/core/Typography';
import { Button, Divider } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Fragment, useEffect } from 'react';
import { confirmDialog } from '../../../components/ConfirmDialog';
import actions from '../../../actions';
import * as selectors from '../../../reducers';
import DeleteIcon from '../../../components/icons/TrashIcon';

const useStyles = makeStyles(theme => ({
  button: {
    margin: theme.spacing(1),
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
  margin: {
    marginTop: '30px',
    marginBottom: '30px',
  },
}));

export default function Uninstall(props) {
  const classes = useStyles();
  const { storeId, integrationId } = props;
  const dispatch = useDispatch();
  const integration =
    useSelector(state =>
      selectors.integrationAppSettings(state, integrationId)
    ) || {};
  const uninstallSteps = useSelector(state =>
    selectors.integrationUninstallSteps(state, integrationId)
  );

  useEffect(() => {
    if (uninstallSteps && uninstallSteps.length) {
      dispatch(actions.resource.request('integrations', integrationId));

      if (integration.settings && integration.settings.supportsMultiStore) {
        props.history.push(
          `/pg/connectors/${integrationId}/uninstall/${storeId}`
        );
      } else {
        props.history.push(`/pg/connectors/${integrationId}/uninstall`);
      }
    }
  }, [
    dispatch,
    integration.settings,
    integration.settings.supportsMultiStore,
    integrationId,
    props.history,
    storeId,
    uninstallSteps,
  ]);

  if (!integration) {
    return null;
  }

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
      <Typography variant="h3">Uninstall</Typography>
      <Typography variant="h5">
        Use this page to uninstall this instance (i.e. this tile) of the
        Integration App. Uninstalling an Integration App will remove all
        components, including the integration tile, from your integrator.io
        account. After uninstalling you can re-install from the marketplace as
        long as you have a valid subscription. Please be very certain that you
        want to uninstall as this action cannot be undone.
      </Typography>
      <Divider className={classes.margin} />
      <Typography variant="h4">
        Once you uninstall this connector there is no going back. Please be
        certain.
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
    </Fragment>
  );
}
