import Typography from '@material-ui/core/Typography';
import { Button } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Fragment, useEffect } from 'react';
import { confirmDialog } from '../../../components/ConfirmDialog';
import actions from '../../../actions';
import * as selectors from '../../../reducers';

const useStyles = makeStyles(theme => ({
  button: {
    margin: theme.spacing(1),
    color: theme.palette.error.main,
    borderColor: theme.palette.error.main,
  },
  rightIcon: {
    marginLeft: theme.spacing(1),
  },
}));

export default function Uninstall(props) {
  const classes = useStyles();
  const { storeId, integrationId } = props;
  const dispatch = useDispatch();
  const integration = useSelector(state =>
    selectors.integrationAppSettings(state, integrationId)
  );
  const uninstallSteps = useSelector(state =>
    selectors.integrationUninstallSteps(state, integrationId)
  );

  useEffect(() => {
    if (uninstallSteps && uninstallSteps.length) {
      dispatch(actions.resource.request('integrations', integrationId));
      props.history.push(
        `/pg/connectors/${integrationId}/uninstall/${storeId}`
      );
    }
  }, [dispatch, integrationId, props.history, storeId, uninstallSteps]);

  if (!integration) {
    return null;
  }

  const initUninstall = () => {
    dispatch(
      actions.integrationApp.uninstaller.preUninstall(storeId, integrationId)
    );
  };

  const handleUninstall = e => {
    e.preventDefault();
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
